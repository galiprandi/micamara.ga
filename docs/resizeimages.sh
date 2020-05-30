#!/bin/bash
cd products_images
identify -format '%w %h %i\n' *.jpg |  
awk '$1 > 500 || $2 > 500 {sub(/^[^ ]* [^ ]* /, ""); print}' | 
tr '\n' '\0' | 
xargs -0 mogrify -verbose -resize '500x500' -background white -gravity center -extent '500x500'