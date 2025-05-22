<!DOCTYPE html>
<html>
<body>

<?php
$x = 5;
$y = 10;

// function myTest() {
//   global $x, $y;
//   $y = $x + $y;
// }

function myTest() {
  $GLOBALS['y'] = $GLOBALS['x'] + $GLOBALS['y'];
} 

myTest();
echo $y; // neue variable $y ausgeben
?>

</body>
</html>
