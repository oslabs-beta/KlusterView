#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir

#Kill port forwarding for saved PIDs
for process_file in $parentdir/deployment/_temp/*.pid; do
  kill -9 $(<$process_file);
done
