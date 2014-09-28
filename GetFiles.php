<?php
    function ShowDir($path){
		$dir = opendir($path);
		while (($file = readdir($dir)) !== false){
		    $sub_path = $path . DIRECTORY_SEPARATOR . $file;
            if ($file == '.' || $file == '..'){
				continue;
			}else if (is_dir($sub_path)){
				ShowDir($sub_path);
			}else{
				$file = substr($file,0,strrpos($file,'.'));
				$file = iconv("gb2312","UTF-8",$file);
				echo '<a href="#" class="list-group-item" onclick="PlaySongs(this);" >' . $file . "</a>";
			}
		}
	}
	ShowDir("../old/Music/");
?>
