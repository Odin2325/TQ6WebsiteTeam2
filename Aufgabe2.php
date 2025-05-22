<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Taschenrechner</title>
</head>
<body>
  <h2>Einfacher PHP-Rechner</h2>
  <form method="post">
    <input type="number" name="zahl1" step="any" required>
    <select name="operation">
      <option value="+">+</option>
      <option value="-">−</option>
      <option value="*">×</option>
      <option value="/">÷</option>
    </select>
    <input type="number" name="zahl2" step="any" required>
    <input type="submit" value="Berechnen">
  </form>

  <?php
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
      $zahl1 = (float)$_POST["zahl1"];
      $zahl2 = (float)$_POST["zahl2"];
      $op = $_POST["operation"];

      echo "<p><strong>Ergebnis:</strong> ";
      switch ($op) {
          case "+":
              echo $zahl1 + $zahl2;
              break;
          case "-":
              echo $zahl1 - $zahl2;
              break;
          case "*":
              echo $zahl1 * $zahl2;
              break;
          case "/":
              if ($zahl2 == 0) {
                  echo "Fehler: Division durch 0!";
              } else {
                  echo $zahl1 / $zahl2;
              }
              break;
          default:
              echo "Ungültige Operation.";
      }
      echo "</p>";
  }
  ?>
</body>
</html>
