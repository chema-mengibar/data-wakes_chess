<?php

  $files = scandir('./reports');
  sort($files); // this does the sorting
  echo'<ul>';
  foreach($files as $file){
     echo'<li><a href="./reports/'.$file.'">'.$file.'</a></li>';
  }
  echo'</ul>';

?>