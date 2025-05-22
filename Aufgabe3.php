<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Begrüßung</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: white;
      text-align: center;
      padding-top: 50px;
      height: 100vh;
      margin: 0;
    }
    .morgen { background-color: #ffcf66; }
    .mittag { background-color: #ff9900; }
    .abend  { background-color: #663399; }
    .nacht  { background-color: #2c3e50; }
  </style>
</head>
<body class="<?php
  $stunde = date("H");
  if ($stunde >= 5 && $stunde <= 11) {
    echo 'morgen';
  } elseif ($stunde >= 12 && $stunde <= 16) {
    echo 'mittag';
  } elseif ($stunde >= 17 && $stunde <= 21) {
    echo 'abend';
  } else {
    echo 'nacht';
  }
?>">
  <h1>
    <?php
      if ($stunde >= 5 && $stunde <= 11) {
        echo "Guten Morgen!";
      } elseif ($stunde >= 12 && $stunde <= 16) {
        echo "Guten Tag!";
      } elseif ($stunde >= 17 && $stunde <= 21) {
        echo "Guten Abend!";
      } else {
        echo "Gute Nacht!";
      }
    ?>
  </h1>
</body>
</html>
