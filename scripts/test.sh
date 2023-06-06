#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir

#Kill port forwarding for saved PIDs
for filename in $parentdir/deployment/_temp/*.txt; do
  echo $(<$filename)
done
touch 'TESTINGTEST.txt'
echo "current_dir is $current_dir"