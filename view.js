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

    const tutorial_button =  `<button id = "tutorial_button" > Get Help! </button>`;
    
    //popup for when user clicks "ok" in the permissions panel
    // const changesSaved = `
    //     <div id="confirmation-dialog">
    //         <p> Changes Saved </p>
    //     </div>
    // `;
    // $("body").append(changesSaved);
    // $("#confirmation-dialog").dialog({
    //     modal: true,
    //     width: 300,
    //     position: {
    //         my: "center", 
    //         at: "top"
    //     },
    //     buttons: [
    //         {
    //             id: "confirmation-button",
    //             text: "ok",
    //             click: function () {
    //                 $(this).dialog("close");
    //             }
    //         }
    //     ]
    // });

    $("body").append(tutorial_button);
    $("#tutorial_button").on("click", function() {
        currentPage = 0;
        updateDialogContent();
       $("#welcome-dialog").dialog("open");
      });

    $("#perm-dialog-ok-button").on("click", function() {
        $("#confirmation-dialog").dialog("open");
    });
    // Initialize dialog content
    updateDialogContent();  // Show the first page's content

    const walk_through = `
        <h3 id="wlk-thru-heading">Fill out the information below to get a guided walkthrough for specific actions within the interface</h3>
        <div class='wlk-thru-container'>
            
            <div class="wlk-thru-section wlk-thru-left-section">
                <p> I need to 
                    <select id="dropdown1" class="wlk-thru-dropdown">
                        <option value="">Select</option>
                        <option value="add">Add</option>
                        <option value="remove">Remove</option>
                        <option value="fix">Fix</option>
                    </select>
                    <select id="dropdown2" class="wlk-thru-dropdown">
                        <option value="">Select</option>
                        <option value="access">Access</option>
                        <option value="read and write">Read & Write</option>
                        <option value="modify">Modify</option>
                        <option value="make changes">Make Changes</option>
                        <option value="entire user">Entire User</option>
                        <option value="inaccessibility">Inaccessibility</option>
                    </select>
                permissions for a 
                    <select id="dropdown3" class="wlk-thru-dropdown">
                        <option value="">Select</option>
                        <option value="new">New</option>
                        <option value="existing">Existing</option>
                    </select>
                user.
                </p>
                <button id="wlk-thru-submitBtn" class="wlk-thru-submit-button" disabled>Submit</button>
            </div>
            
            <div class="wlk-thru-section wlk-thru-right-section">
                <p id="wlk-thru-rightMessage">Please fill out the options to the right for a guided walkthrough.</p>
                <div id="wlk-thru-Content"></div>
            </div>
        </div>
    `;

    $("body").append(walk_through);
    SetupWlkthru();
});

function SetWlkthruMsg(arr, action, perm, status) {
    if (action=="add" && perm=="access" && status=="new") {
        return arr[1];
    }
    else if (action=="fix" && perm=="inaccessibility" && status=="existing") {
        return arr[2];
    }
    else if (action=="add" && perm=="read and write" && status=="existing") {
        return arr[3];
    }
    else if (action=="add" && perm=="modify" && status=="existing") {
        return arr[4];
    }
    else if (action=="remove" && perm=="entire user" && status=="existing") {
        return arr[5];
    }
    else if (action=="remove" && perm=="access" && status=="existing") {
        return arr[6];
    }
    else if (action=="remove" && perm=="make changes" && status=="existing") {
        return arr[7];
    }
    else {
        return arr[0];
    }
}

function SetupWlkthru() {
    // References to dropdowns and submit button
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    const dropdown3 = document.getElementById('dropdown3');
    const submitBtn = document.getElementById('wlk-thru-submitBtn');
    const rightMessage = document.getElementById('wlk-thru-rightMessage');
    const walkthroughContent = document.getElementById('wlk-thru-Content');

    // Array of all dropdowns
    const dropdowns = [dropdown1, dropdown2, dropdown3];

    // Walkthrough content array
    const walkthroughData = [
        `<p>Sorry, that action is undefined. Try selecting something more relevant</p>`,
        `<p>to grant <strong>complete access</strong> for the user do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need access to</li>
                <li>click add user</li>
                <li>select the user you need to give access to, and click OK</li>
                <li>you should now see that user on the list. select them</li>
                <li>for the "full control" permission select ALLOW</li>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>
        <p>to grant <strong>general access</strong> for the user do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need access to</li>
                <li>click add user</li>
                <li>select the user you need to give access to, and click OK</li>
                <li>you should now see that user on the list. select them</li>
                <li>for the "read", "write", and "modify" permissions select ALLOW</li>
                <ul>
                    <li>if the access needs to be the same as another employee, make sure to click on another employee to verify they have the same permissions selected</li>
                </ul>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`,
        `<p>to fix <strong>inaccessibility</strong> errors for a user and/or group do the following actions for <strong>EACH</strong> file within the relevant subfolder:
            <ol>
                <li>click on the edit permissions button next to the file they need access to</li>
                <li>if no users are listed, click "inherit permission from parent"</li>
                <li>click save</li>
                <li>if users are listed, make sure their permissions are set to allow and deny for what they need access to</li>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`,
        `<p>to add <strong>read and write</strong> permissions for a user do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need access to</li>
                <li>select the user you need to add the permissions for</li>
                <li>for the "read execute" and "write" permissions select ALLOW</li>
                <ul>
                    <li>*this will not give them delete permissions</li>
                </ul>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`,
        `<p>to add <strong>modify</strong> permissions for a user do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need access to</li>
                <li>if the user is a part of a group, select that group from the list of users</li>
                <li>if modify is set to DENY for that group, unselect that option</li>
                <li>click save</li>
                <li>if the user is NOT a part of a group, select the user from the list of users</li>
                <li>for the "modify" permission select ALLOW</li>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`,
        `<p>to remove an <strong>entire users</strong> permissions do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need to be removed from</li>
                <li>select the user you need to remove</li>
                <li>click remove user</li>
                <ul>
                    <li>*if an error message pops up, follow its instructions to resolve the error</li>
                    <li>then reselect the user, and click remove user once more</li>
                </ul>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`,
        `<p>to remove <strong>access and make changes</strong> permissions for a user do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need to be removed from</li>
                <li>select the user you need to remove the permissions for</li>
                <li>for the "full control" permission select DENY</li>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`,
        `<p>IF you need to remove <strong>access AND make changes</strong> permissions choose the "access" permission option to the right</p>
        <p>to remove <strong>make changes</strong> permissions for a user that <strong>DOES NOT</strong> belong to a group do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need to be removed from</li>
                <li>select the user you need to remove the permissions for</li>
                <li>for the "modify" permission select DENY</li>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>
        <p>to remove <strong>make changes</strong> permissions for a user that <strong>DOES</strong> belong to a group do the following actions:
            <ol>
                <li>click on the edit permissions button next to the file they need to be removed from</li>
                <li>click add user</li>
                <li>select the user you need to remove the permissions for, and click OK</li>
                <li>you should now see that user on the list. select them</li>
                <li>for the "modify" permission select DENY</li>
                <li>click save</li>
                <li>thats it!</li>
            </ol>
        </p>`
    ];

    // Function to check if all dropdowns have been selected
    const validateDropdowns = () => {
        const allSelected = dropdowns.every(dropdown => dropdown.value !== '');
        submitBtn.disabled = !allSelected;
    };

    // Attach change event to all dropdowns
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', validateDropdowns);
    });

    // Function to display walkthrough content
    const displayWalkthrough = () => {
        // Generate a unique combination based on dropdown selections
        rightMessage.style.display = 'none';
        walkthroughContent.innerHTML = '';

        const title =  document.createElement('h4');
        title.textContent = `Here's how to ${dropdown1.value} ${dropdown2.value} permissions for a ${dropdown3.value} user`;
        walkthroughContent.appendChild(title);

        let instructions = SetWlkthruMsg(walkthroughData, dropdown1.value, dropdown2.value, dropdown3.value);
        $("#wlk-thru-Content").append(instructions);
    };

    // Attach click event to the submit button
    submitBtn.addEventListener('click', displayWalkthrough);
}




// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)
    // console.log(file_obj.owner);

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"> 
                        <span style="font-family: Arial,Helvetica,sans-serif; margin-left: 5px;"> Edit Permissions</span>
                    </span>
                </button>
                <div style="margin: 10px 0px 0px 25px;">
                    <h4>Folder Owner: ${file_obj.owner}</h4>
                </div>
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
        console.log(file_obj);
        console.log(file_hash);
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon">
                    <span style="font-family: Arial,Helvetica,sans-serif; margin-left: 5px;"> Edit Permissions</span>
                </span>
            </button>
            <h4 style="margin: 5px 0px 10px 0px;">File Owner: ${file_obj.owner}</h4>
            <h4 style="margin: 5px 0px 10px 0px;"> Parent: ${file_hash.split('/')[file_hash.split('/').length - 2]} </h4>
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
/*
* $('.oi-lock-unlocked').each(function() {
*     $(this).text('Edit Permissions');
*     $(this).removeClass('oi oi-lock-unlocked'); // Optional: remove icon classes for styling
* });
*/

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
    if ($(this).prop(':checked')) {
        let denyCheckboxId = $(this).attr('id').replace('allow', 'deny');
        $('#' + denyCheckboxId).prop('checked', false);
    }
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 


// MANUAL EDITS FROM HERE =========================
// ================================================

$('#sidepanel').css({
    'margin': '5px 0px 0px 5px',
})
// Effective Permissions
// let effective_perms = define_new_effective_permissions("eff_perms", true)
let effective_perms = define_new_collected_permissions("eff_perms", true)
$('#sidepanel').append(effective_perms)
let selection_container = $("<div></div>")
selection_container.css({
    'border': '1px solid #003eff', 'border-radius' : '0px 0px 3px 3px',
    'background': '#007fff', 'color': '#fff', 
    'font-weight': 'normal', 'font-size': '100%', 'font-family' : 'Arial,Helvetica,sans-serif',
    'padding' : '.5em .5em .5em .7em',
})
let user_select = define_new_user_select_field('user_select', 'Select User', function(selected_user) {
    $('#eff_perms').attr('username', selected_user)
})
let file_select = define_new_file_select_field('file_select', 'Select File', function(selected_file) {
    $('#eff_perms').attr('filepath', selected_file)
})
selection_container.append(user_select)
selection_container.append(file_select)
$('#sidepanel').append(selection_container)
$('#eff_perms').css({
    'padding': '10px 0px',
})
effective_perms.show();
user_select.show();


// Update the effective permissions when OK button is clicked
$('#perm-dialog-ok-button').click(function() {
    let old_eff_perms = $('#eff_perms');
    let filepath = old_eff_perms.attr('filepath');
    let username = old_eff_perms.attr('username');
    old_eff_perms.remove();
    // effective_perms = define_new_effective_permissions("eff_perms", true)
    effective_perms = define_new_collected_permissions("eff_perms", true)
    $('#user_select_line').before(effective_perms)
    $('#eff_perms').attr('filepath', filepath).attr('username', username);
})

let dialog = define_new_dialog('explanation_dialog', 'Permission Explanation')

$('.perm_info').click(function(){
    let filePath = $('#eff_perms').attr('filepath')
    let username = $('#eff_perms').attr('username')
    if (username == null && filePath == null) {
        dialog.dialog('open')
        dialog.text('Please select a user and file first')
    }
    else if (username == null) {
        dialog.dialog('open')
        dialog.text('Please select a user first')
    } 
    else if (filePath == null) {
        dialog.dialog('open')
        dialog.text('Please select a file first')
    }
    else {
        let permName = $(this).attr('permission_name')
        let file_obj = path_to_file[filePath]
        let user_obj = all_users[username]
        let response_obj = allow_user_action(file_obj, user_obj, permName, true)
        console.log("Response:", response_obj)
        let explanation_text = get_explanation_text(response_obj)
        console.log("Explanation:", explanation_text)
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
$(document).ready(function() {
    const explainTextbox = $('<div></div>')
      .attr('id', 'hoverText')
      .text('')
      .css({
        position: 'absolute',
        display: 'none',
        background: '#f0f0f0',
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
    $('.groupcheckbox').on('mouseenter', function(event) {
      // Extract permission name based on the closest row ID or the group attribute
      console.log($(this));
      if ($(this).prop('disabled')) { 
        console.log("is disabled");
        let explainText = '<p style="font-size: 16px;">' + "this permission is inherited from a parent" + '</p>';
        explainTextbox.append(explainText);
        explainTextbox.show();
      }
      
    });

    // Hide the textbox on mouse leave
    $('.groupcheckbox').on('mouseleave', function() {
      explainTextbox.hide();
      explainTextbox.html('');
    });

    // Update the textbox position on mouse move
    $('.groupcheckbox').on('mousemove', function(event) {
        explainTextbox.css({
          top: event.pageY + 10,
          left: event.pageX + 10
        });
    });
});
