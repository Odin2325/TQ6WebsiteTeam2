<!DOCTYPE html>
<html>
<body>

<?php
function myTest() {
  $x = 5; // local scope
  echo "<p>Variable x innerhalb der funktion: $x</p>";
} 
myTest();

// Die Verwendung von x außerhalb der Funktion führt zu einem Fehler
echo "<p>Variable x ausserhalb der funktion: $x</p>";
?>

</body>
</html>
