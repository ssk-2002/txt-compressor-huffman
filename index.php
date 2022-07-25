<!-- WHY index.php? 
-> We use it to make our page DYNAMIC
-> It is beacuse sometimes you may have some logic written on index.php. 
   Like you may check if user is logged in or not and then redirect user to some specific page. 
   Also you may do device based redirection as in case of mobile devices. 

-> Apache Server processes first index.php then index.html-->

<?php

  include_once("index.html");

?>
