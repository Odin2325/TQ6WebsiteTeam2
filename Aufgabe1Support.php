<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $nachricht = htmlspecialchars($_POST["nachricht"]);

    echo "<h2>Vielen Dank für deine Nachricht!</h2>";
    echo "<p><strong>Name:</strong> $name</p>";
    echo "<p><strong>E-Mail:</strong> $email</p>";
    echo "<p><strong>Nachricht:</strong><br>$nachricht</p>";
} else {
    echo "Bitte fülle zuerst das Formular aus.";
}
?>
