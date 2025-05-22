<!DOCTYPE html>
<html>
<body>

<?php
$x = 5; // global scope
 
function myTest() {
  // wenn wir x innerhalb der Funktion verwenden wollen, müssen wir es global machen. 
  // Ansonsten haben wir einen Fehler
  global $x; // global variable
  echo "<p>Variable x inside function is: $x</p>";
} 
myTest();

echo "<p>Variable x outside function is: $x</p>";
?>

</body>
</html>
