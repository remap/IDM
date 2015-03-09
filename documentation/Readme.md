#How to force RGB in Mac OS X
	1.	Download the patch-edid.rb script from the forums thread above and put it in your home directory.
	2.	Connect only the external monitor(s) in question (I closed my MacBook lid, for example). The script will make override files for any connected monitor.
	3.	Type “ruby patch-edid.rb” in Terminal.
	4.	A new folder will be created in your home directory. Move it into the “/System/Library/Displays/Overrides” folder. If Finder tells you that you are overwriting an existing folder, consider backing it up first.
	5.	Restart your computer, enjoy your monitor.
To undo the changes, either delete the folder you had copied to the Overrides folder (if it didn’t already exist) or replace it with the folder you had backed up.


Source: http://www.ireckon.net/2013/03/force-rgb-mode-in-mac-os-x-to-fix-the-picture-quality-of-an-external-monitor