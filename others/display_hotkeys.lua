-- Define the HTML content for the button
local html = [[
<div class="container">
  <textarea id="messageInput" placeholder="Type a message"></textarea>
  <button id="sendButton">Display Text</button>
</div>
]]

-- Define the function to be executed when the button is clicked
local function handleButtonClick()
    local messageInput = gui.get_value("messageInput")
    obs.script_log(obs.LOG_INFO, "Text entered: " .. messageInput)

    -- You can perform any action you want with the text here
    -- For example, display the text in OBS text source or do other operations.
end

-- Load the HTML and set up the button functionality
function script_load(settings)
    local script_dir = script_path()
    local file = io.open(script_dir .. "../control_panel.html", "w")
    file:write(html)
    file:close()

    local props = obs.obs_properties_create()
    obs.obs_properties_add_html(props, "html", html)

    obs.obs_properties_apply_settings(props, settings)
end

-- Save settings (if needed)
function script_save(settings)
    -- You can add saving functionality here if needed.
end

-- Execute the function when the button is clicked
function handleButtonClickPressed(pressed)
    if not pressed then
        return
    end

    handleButtonClick()
end

-- Register the hotkey and button click function
function script_description()
    return "Hotkey with Button - Display Text"
end

function script_properties()
    local props = obs.obs_properties_create()

    local hotkey = obs.obs_properties_add_list(props, "hotkey", "Hotkey Trigger", obs.OBS_COMBO_TYPE_HOTKEY, obs.OBS_HOTKEY_DEFAULT)
    obs.obs_property_set_enabled(hotkey, false) -- Disable default hotkey assignment

    return props
end

function script_update(settings)
    local hotkey_save_array = obs.obs_hotkey_save(obs.obs_properties_get(props, "hotkey"))
    obs.obs_data_set_array(settings, "hotkey", hotkey_save_array)
    obs.obs_data_array_release(hotkey_save_array)
end

function script_load(settings)
    local hotkey_save_array = obs.obs_data_get_array(settings, "hotkey")
    obs.obs_properties_apply_settings(props, settings)
    obs.obs_data_array_release(hotkey_save_array)

    -- Register the hotkey and the button click function
    local hotkey_id = obs.obs_hotkey_register_frontend("Hotkey with Button", "Hotkey with Button - Display Text", handleButtonClickPressed)
    local hotkey_save_array = obs.obs_data_get_array(settings, "hotkey")
    obs.obs_hotkey_load(hotkey_id, hotkey_save_array)
    obs.obs_data_array_release(hotkey_save_array)
end

function script_unload()
    obs.obs_hotkey_unregister(handleButtonClickPressed)
end
