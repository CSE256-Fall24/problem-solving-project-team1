// ---- Define your dialogs  and panels here ----

// tutorial dialog 
$(document).ready(function () {
    // Array of dialog pages
    const pages = [
        `<p>Hi! On this page, you'll be given a task, which asks you to edit file permissions for specified users. Here is a brief overview of how permissions are determined for a given file: </p>
        <br></br>
        <ul> 
            <li>Each file/folder has direct permission applied to them. These permissions <strong> take precedence </strong> over inherited permissions</li>
            <li> Direct permissions that <strong> "deny" </strong> access always take precedence over <strong> "allow" </strong> </li>
            <li>If there are no direct permission applied for a particular action (ie. Read), the file will <strong> inherit the permissions of its parent</strong> (the folder it sits in). </li>
            <li> The owner of a file/folder always has <strong> full control </strong> of a file. </li>
            <li> A user can be a part of a <strong>"group"</strong>. Unless specified for the individual user, users also inherit permissions set for the group. </li> 

        </ul>
        `
        ,
        `<p>Phew that was a lot!</p> <br></br>
        <p>To help you get started, <strong>select a file/folder of interest by clicking on the file/folder. </strong> </p> <br></br>
        <p> Then, select <strong>the user you want to view permissions for</strong>.</p> <br></br>
        <p> The panel will show you all the permissions that user has, for the selected file. <strong> click on the "i" button to see why the user has the given permission </strong></p>`
       ,
       
        `<p><strong>Some rules of thumbs: </strong></p>
        <br></br>
        <ul>
            <li> Direct permissions override any permissions from parent folders</li> <br></br>
            <li> Grayed out permissions (within the "edit permission" window) means the permission is inherited from a parent.</li> <br/>
            <li> If a permission is "allowed" due to inheritance, applying "deny" to the file of interest directly will override the "allow".</li>
        </ul>
        `
    ];
    
    let currentPage = 0;  // Initialize to the first page

    // Function to update dialog content based on current page
    function updateDialogContent() {
        $("#welcome-dialog-content").html(pages[currentPage]);

        // Update button states based on the current page
        $("#back-button").toggle(currentPage > 0);  // Hide Back on first page
        $("#next-button").toggle(currentPage < pages.length - 1); // Hide Next on last page
        $("#finish-button").toggle(currentPage === pages.length - 1); // Show Finish on last page
    }

    // Create the dialog HTML structure dynamically
    const dialogContent = `
        <div id="welcome-dialog" title="Welcome">
            <div id="welcome-dialog-content"></div>
        </div>
    `;
    $("body").append(dialogContent);

    // Initialize the dialog
    $("#welcome-dialog").dialog({
        autoOpen: true,
        modal: true,
        width: 500,
        position: {
            my: "center", 
            at: "top"
        },
        buttons: [
            {
                id: "back-button",
                text: "Back",
                click: function () {
                    if (currentPage > 0) {
                        currentPage--;
                        updateDialogContent();
                    }
                }
            },
            {
                id: "next-button",
                text: "Next",
                click: function () {
                    if (currentPage < pages.length - 1) {
                        currentPage++;
                        updateDialogContent();
                    }
                }
            },
            {
                id: "finish-button",
                text: "Finish",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });

    // Initialize dialog content
    updateDialogContent();  // Show the first page's content
});



// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)
// Change all lock icons to "Edit Permissions" text
$('.oi-lock-unlocked').each(function() {
    $(this).text('Edit Permissions');
    $(this).removeClass('oi oi-lock-unlocked'); // Optional: remove icon classes for styling
});
    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});

// ---- Checkbox Interaction Logic for Deny/Allow ----

// Listen for changes on all Deny checkboxes using event delegation
$(document).on('change', 'input[type="checkbox"][ptype="deny"]', function() {
    // Check if this Deny checkbox is checked
    if ($(this).is(':checked')) {
        // Find the corresponding Allow checkbox and uncheck it
        let allowCheckboxId = $(this).attr('id').replace('deny', 'allow'); // Adjust if IDs are structured differently
        $('#' + allowCheckboxId).prop('checked', false);
    }
});

// Listen for changes on all Allow checkboxes using event delegation
$(document).on('change', 'input[type="checkbox"][ptype="allow"]', function() {
    if ($(this).is(':checked')) {
        let denyCheckboxId = $(this).attr('id').replace('allow', 'deny');
        $('#' + denyCheckboxId).prop('checked', false);
    }
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 


let effective_perms = define_new_effective_permissions("eff_perms", true)
$('#sidepanel').append(effective_perms)
let user_select = define_new_user_select_field('user_select', 'Select User', function(selected_user) {
    $('#eff_perms').attr('username', selected_user)
})
$('#sidepanel').append(user_select)
effective_perms.hide();
user_select.hide();

$('.file').click(function(event) {
    let filepath = $(this).attr('id').replace('_div', '');
    $('#eff_perms').attr('filepath', filepath);
    $('.file').css('color','');
    $(this).css('color','blue');
    $('#eff_perms').show();
    user_select.show()
    console.log(filepath);
    event.stopPropagation();
})

$(document).click(function(event) {
    if ($(event.target).is('body') || $(event.target).is('html')) {
        $('.file').css('color','');
        $('#eff_perms').hide();
        user_select.hide();
        $('#eff_perms').removeAttr('filepath');
        console.log("Clicked elsewhere");
    }
});



let dialog = define_new_dialog('explanation_dialog', 'Permission Explanation')

$('.perm_info').click(function(){
    let filePath = $('#eff_perms').attr('filepath')
    let username = $('#eff_perms').attr('username')
    if (username == null || filePath == null) {
        dialog.dialog('open')
        dialog.text('Please select a user first')
    } else {
        let permName = $(this).attr('permission_name')
        let file_obj = path_to_file[filePath]
        let user_obj = all_users[username]
        let response_obj = allow_user_action(file_obj, user_obj, permName, true)
        let explanation_text = get_explanation_text(response_obj)
        dialog.dialog('open')
        dialog.text(explanation_text)
    }
})


$(document).ready(function() {
    const explainTextbox = $('<div></div>')
      .attr('id', 'hoverText')
      .text('')
      .css({
        position: 'absolute',
        display: 'none',
        background: '#f0f0f0',  // Optional styling
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: '1000',
        fontSize: '12px',
        color: '#666',
        width: '300px'
    });
    $('body').append(explainTextbox);

    // Show and update the textbox on mouse enter
    $('.grouped_perms_row').on('mouseenter', function(event) {
      // Update the textbox content based on the hovered element's ID
      let permName = extractPermission($(this).attr('id'))
      let explainTitle = '<h3 style="font-size: 20px;">' + permName + '</h3><br><br>'
      explainTextbox.append(explainTitle)
      let descText = getPermDesc(permName)
      let explainText = '<p style="font-size: 16px;">' + descText + '</p>'
      explainTextbox.append(explainText)
      explainTextbox.show()
      
    });
  
    // Hide the textbox on mouse leave
    $('.grouped_perms_row').on('mouseleave', function() {
      explainTextbox.hide();
      explainTextbox.html('');
    });

    $('.grouped_perms_row').on('mousemove', function(event) {
        // Only update the position of the hover text element
        explainTextbox.css({
          top: event.pageY + 10,  // Offset for readability
          left: event.pageX + 10
        });
      });
  });
