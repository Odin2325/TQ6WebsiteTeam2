<!DOCTYPE html>
<html>
<body>

<h1>Klassen Eigenschaften</h1>

<?php

class Car {
  public $color;
  public $model;
  public function __construct($color, $model) {
    $this->color = $color;
    $this->model = $model;
  }
}

$myCar = new Car("red", "Volvo");

foreach ($myCar as $x => $y) {
  echo "$x: $y <br>";
}

?>

</body>
</html>
