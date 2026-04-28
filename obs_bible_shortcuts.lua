obs = obslua

local browser_source_name = ""
local hotkey_ids = {}

local actions = {
    { id = "send_text", description = "OBS Bible Plugin: Send current text", action = "send_text" },
    { id = "toggle_display", description = "OBS Bible Plugin: Toggle display", action = "toggle_display" },
    { id = "open_edit_tab", description = "OBS Bible Plugin: Open Edit tab", action = "open_edit_tab" },
    { id = "open_bible_tab", description = "OBS Bible Plugin: Open Bible tab", action = "open_bible_tab" },
    { id = "open_song_tab", description = "OBS Bible Plugin: Open Song tab", action = "open_song_tab" },
    { id = "open_settings_tab", description = "OBS Bible Plugin: Open Settings tab", action = "open_settings_tab" },
    { id = "align_left", description = "OBS Bible Plugin: Align left", action = "align_left" },
    { id = "align_center", description = "OBS Bible Plugin: Align center", action = "align_center" },
    { id = "align_right", description = "OBS Bible Plugin: Align right", action = "align_right" },
    { id = "align_justify", description = "OBS Bible Plugin: Align justify", action = "align_justify" },
    { id = "song_previous", description = "OBS Bible Plugin: Previous song line or verse", action = "song_previous" },
    { id = "song_next", description = "OBS Bible Plugin: Next song line or verse", action = "song_next" },
    { id = "song_toggle_autoplay", description = "OBS Bible Plugin: Toggle song autoplay", action = "song_toggle_autoplay" },
    { id = "bible_previous", description = "OBS Bible Plugin: Previous Bible verse", action = "bible_previous" },
    { id = "bible_next", description = "OBS Bible Plugin: Next Bible verse", action = "bible_next" }
}

local function build_dispatch_script(action)
    return string.format([[
        (function () {
            const channel = new BroadcastChannel("obs-bible-remote");
            channel.postMessage({ action: %q });
            channel.close();
        })();
    ]], action)
end

local function dispatch_action(action)
    if browser_source_name == nil or browser_source_name == "" then
        obs.script_log(obs.LOG_WARNING, "OBS Bible Plugin shortcuts: set the browser source name in the script settings first.")
        return
    end

    local source = obs.obs_get_source_by_name(browser_source_name)
    if source == nil then
        obs.script_log(obs.LOG_WARNING, "OBS Bible Plugin shortcuts: browser source not found: " .. browser_source_name)
        return
    end

    local proc_handler = obs.obs_source_get_proc_handler(source)
    if proc_handler == nil then
        obs.script_log(obs.LOG_WARNING, "OBS Bible Plugin shortcuts: selected source does not expose a proc handler.")
        obs.obs_source_release(source)
        return
    end

    local calldata = obs.calldata_create()
    obs.calldata_set_string(calldata, "script", build_dispatch_script(action))
    local ok = obs.proc_handler_call(proc_handler, "execute_javascript", calldata)
    obs.calldata_destroy(calldata)
    obs.obs_source_release(source)

    if not ok then
        obs.script_log(obs.LOG_WARNING, "OBS Bible Plugin shortcuts: failed to dispatch action '" .. action .. "'. Make sure the selected source is your OBS Bible browser source.")
    end
end

local function make_hotkey_callback(action)
    return function(pressed)
        if pressed then
            dispatch_action(action)
        end
    end
end

function script_description()
    return [[
OBS Bible Plugin shortcuts for OBS.

1. Set the browser source name used by OBS Bible Plugin.
2. Open OBS Settings -> Hotkeys.
3. Search for "OBS Bible Plugin:" and assign the keys you want.

The hotkeys trigger the plugin through the browser source, so they keep working even when the dock is not focused.
]]
end

function script_properties()
    local props = obs.obs_properties_create()
    obs.obs_properties_add_text(props, "browser_source_name", "OBS Bible browser source name", obs.OBS_TEXT_DEFAULT)
    return props
end

function script_defaults(settings)
    obs.obs_data_set_default_string(settings, "browser_source_name", "OBS Bible Browser")
end

function script_update(settings)
    browser_source_name = obs.obs_data_get_string(settings, "browser_source_name")
end

function script_load(settings)
    script_update(settings)

    for _, item in ipairs(actions) do
        local hotkey_id = obs.obs_hotkey_register_frontend(
            "obs_bible_plugin." .. item.id,
            item.description,
            make_hotkey_callback(item.action)
        )
        hotkey_ids[item.id] = hotkey_id

        local hotkey_save_array = obs.obs_data_get_array(settings, "hotkey_" .. item.id)
        obs.obs_hotkey_load(hotkey_id, hotkey_save_array)
        obs.obs_data_array_release(hotkey_save_array)
    end
end

function script_save(settings)
    for _, item in ipairs(actions) do
        local hotkey_save_array = obs.obs_hotkey_save(hotkey_ids[item.id])
        obs.obs_data_set_array(settings, "hotkey_" .. item.id, hotkey_save_array)
        obs.obs_data_array_release(hotkey_save_array)
    end
end
