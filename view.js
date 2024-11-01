// ---- Define your dialogs  and panels here ----



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

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 


let effective_perms = define_new_effective_permissions("eff_perms", true)
$('#sidepanel').append(effective_perms)


let user_select = define_new_user_select_field('user_select', 'Select User', function(selected_user) {
    $('#eff_perms').attr('username', selected_user)
    $('#eff_perms').attr('filepath', '/C/presentation_documents/important_file.txt')
})
$('#sidepanel').append(user_select)


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