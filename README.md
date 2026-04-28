# OBS BIBLE PLUGIN

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a free bible plugin that you can use to display bible passages in Open Broadcasting Studio.
I made it with the intention of helping me to display Bible passages since I could not find a free plugin to display Bible.
You can modify it for your use.

# ANNOUNCEMENT
## BIBLE DISPLAY  SOFTWARE
I have made a software for displaying Bible. It is called Bible Display Software. You can download it at bibleds.vercel.app  [bibleds.vercel.app](https://bibleds.vercel.app).
I will like feed back from it. The trial version lasts for 30 days while the paid version is free for life. You are also entitled to minor updates for free.

Please contribute to my project. It is what helps me to continue developing this plugin for free. God bless yoiu.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/tosin789)  

I am available for hire. I am skilled in python, Javascript, HTML and CSS. Thank you for your assistance.

OBS Bible Plugin is now available in the following versions.

1. Authorized King James Version (KJV)
2. New King James Version (NKJV)
3. Louis Segond 1920 (French Version)
4. Reina-Valera Revision 1960 (RV60) (Spanish Version)

![alt text](https://github.com/Tosin-JD/obs-bible-plugin/blob/main/Screenshot_20230918_110233.png)  


# How to Install the plugin
1. Download the **[obs_bible_plugin.zip](https://github.com/Tosin-JD/obs-bible-plugin/releases)** from the release page.
2. Extract the zip file.
3. Copy the **obs-bible-plugin** or which ever version folder to a safe location in your computer.
4. Open the **obs-bible-plugin** folder.
5. Copy the URL or PATH of the **control_panel.html**.
6. Click on **Docks** > **Custom Browser Docks**
7. Paste the URL or PATH of the **control_panel.html**.
8. On the Dialog Box that pops up, Under **Dock Name** enter the name of the Dock, example: **Bible Plugin** or any name of your choice.
9. Copy the URL or PATH of the **browser_source.html**.
10. Click on Add Source or the **+** button.
11. Click on **Browser**.
12. Paste the URL or PATH of the **browser_source.html** in the input box for URL.
_Please, make sure that you do not check **checkbox** for **Local file**._ (Leave it off.)
13. Specify the width and height of the Browser to your preference.
14. Click on **OK**.
   15. You can type on the textbox to display text and you can click on bible passages to display it.

## How to add Shortcut through LUA
### Before you start

Make sure you already added:

1. `control_panel.html` as a Custom Browser Dock
2. `browser_source.html` as a Browser Source

The Lua script sends commands through the browser source, so the browser source must exist in your OBS scene collection.

### How to install the Lua script

1. In OBS, go to `Tools -> Scripts`.
2. Click the `+` button.
3. Select `obs_bible_shortcuts.lua`.
4. In the script settings, enter the exact name of your OBS Bible browser source.
   Example: `OBS Bible Browser`

### How to assign shortcuts

1. In OBS, go to `Settings -> Hotkeys`.
2. Search for `OBS Bible Plugin:`.
3. Assign the keys you want for each action.
4. Click `Apply`, then `OK`.


## Keyboard shortcuts inside the plugin

These work directly inside the OBS Bible Plugin panel:

1. `Ctrl/Cmd + Up` toggles display.
2. `Ctrl/Cmd + Down` sends the current text to the browser source.
3. `Ctrl/Cmd + Shift + L` aligns text left.
4. `Ctrl/Cmd + Shift + E` aligns text center.
5. `Ctrl/Cmd + Shift + R` aligns text right.
6. `Ctrl/Cmd + Shift + J` justifies text.
7. `Alt + 1` opens the Edit tab.
8. `Alt + 2` opens the Bible tab.
9. `Alt + 3` opens the Song tab.
10. `Alt + 4` opens the Settings tab.

Clipboard shortcuts such as `Cmd/Ctrl + A`, `C`, `V`, and `X` are also handled for focused text inputs inside the plugin panel.

## How to use OBS hotkeys with the plugin

If you want OBS-level hotkeys that work even when the dock is not focused, use the included Lua script.

### Step 1. Add the Lua script to OBS

1. Open OBS.
2. Go to `Tools -> Scripts`.
3. Click the `+` button.
4. Select `obs_bible_shortcuts.lua` from this project folder.

### Step 2. Tell the script which browser source to control

1. In the script panel, find the field named `OBS Bible browser source name`.
2. Enter the exact name of the browser source you created for `browser_source.html`.
3. Make sure the name matches exactly, including spaces.

### Step 3. Assign your hotkeys

1. Go to `Settings -> Hotkeys`.
2. Search for `OBS Bible Plugin:`.
3. Set the keys you want for each action.
4. Click `Apply`, then `OK`.

### Step 4. Use the Lua hotkeys

The Lua script exposes these actions:

1. Send current text
2. Toggle display
3. Open Edit tab
4. Open Bible tab
5. Open Song tab
6. Open Settings tab
7. Align left
8. Align center
9. Align right
10. Align justify
11. Previous song line or verse
12. Next song line or verse
13. Toggle song autoplay
14. Previous Bible verse
15. Next Bible verse

For more details, see [docs/lua-shortcuts.md](docs/lua-shortcuts.md).


## How to Display A Bible Passage
1. Go to the Bible tab
2. Search for the Bible Passage with name such is **John 1:1** or with a passage from the scripture as: **Love your neighbor as yourself**
3. Click on the Bible Verse to display it.

## How to Display A Song
You can display song in two ways.  
a. Line by line  
b. verse by verse   

### How to display a song line by line
1. Go to the **Song** Tab
2. Upload the song that you want to display. See the section below on how to upload a song.
3. In order to display a song line by line, go to the **Settings** Tab, under **General** Check **Display Song Line by Line**.  
4. Then go to the **Songs** Tab and click on the line that you want to display.  

### How to display a song verse by verse
1. In order to display a song verse by verse, go to the **Settings** Tab, under **General** Uncheck **Display Song Line by Line**.  
2. Then go to the **Songs** Tab and click on the verse that you want to display.

## How to Add Song
In order to add song
1. Go to the **Song** tab
2. Click on **Choose File** to upload a song a txt file that contains a song: **Example:** **song.txt**
3. If you want to differentiate the chorus, make sure that the first line of the chorus is the word "CHORUS"
4. Click on any line to display it.

### Your _song.txt_ file should be arranged in this format.
1.
O soul, are you weary and troubled?  
No light in the darkness you see?  
There’s light for a look at the Savior,  
And life more abundant and free!  
CHORUS  
Turn your eyes upon Jesus,  
Look full in His wonderful face,  
And the things of earth will grow strangely dim,  
In the light of His glory and grace.  
2.
Through death into life everlasting  
He passed, and we follow Him there;  
O’er us sin no more hath dominion—  
For more than conqu’rors we are!  
3.
His Word shall not fail you—He promised;  
Believe Him, and all will be well:  
Then go to a world that is dying,  
His perfect salvation to tell!

I hope that as time goes on, we would be able to add more translations. Thank you. God bless you.

Made with ❤️.
