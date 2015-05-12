<?php
require('PrettyPrintJSON.php');
header('Content-Type: application/json');
// From PHP manual pages
//
$ritit = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('images', RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST );
$r = array();
foreach ($ritit as $splFileInfo) {
   $path = $splFileInfo->isDir()
         ? array($splFileInfo->getFilename() => array())
         : array($splFileInfo->getFilename());

   for ($depth = $ritit->getDepth() - 1; $depth >= 0; $depth--) {
       $path = array($ritit->getSubIterator($depth)->current()->getFilename() => $path);
   }
   $r = array_merge_recursive($r, $path);
}

// Pretty printing just makes it easier
// to review the output by hand.
$j = prettyPrintJSON(json_encode($r));
echo($j);

?>

