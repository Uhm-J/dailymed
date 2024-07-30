#!/bin/bash

# Default output file
output_file="merged_files.txt"

# Default file extensions to include
default_extensions="py js tsx ts html css"
extensions="$default_extensions"

# Default directories to ignore
default_ignore_dirs="node_modules .next .git __pycache__"
ignore_dirs="$default_ignore_dirs"

# Function to display help message
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --ignore DIR1 DIR2 ...    Override the default ignored directories"
    echo "  --ignore+ DIR1 DIR2 ...   Add directories to the default ignored list"
    echo "  --ext EXT1 EXT2 ...       Override the default file extensions"
    echo "  --ext+ EXT1 EXT2 ...      Add file extensions to the default list"
    echo "  -o OUTPUT_FILE            Specify output file (default: merged_files.txt)"
    echo "  -h                        Show this help message"
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --ignore)
            shift
            ignore_dirs=""
            while [[ $# -gt 0 && $1 != --* ]]; do
                ignore_dirs+="$1 "
                shift
            done
            ;;
        --ignore+)
            shift
            while [[ $# -gt 0 && $1 != --* ]]; do
                ignore_dirs+="$1 "
                shift
            done
            ;;
        --ext)
            shift
            extensions=""
            while [[ $# -gt 0 && $1 != --* ]]; do
                extensions+="$1 "
                shift
            done
            ;;
        --ext+)
            shift
            while [[ $# -gt 0 && $1 != --* ]]; do
                extensions+="$1 "
                shift
            done
            ;;
        -o)
            output_file="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Clear the output file if it exists
> "$output_file"

# Build the find command with excluded directories and specified file types
find_command="find ."
for dir in $ignore_dirs; do
    find_command+=" -name '$dir' -prune -o"
done
find_command+=" -type f \("
for ext in $extensions; do
    find_command+=" -name '*.$ext' -o"
done
find_command="${find_command% -o} \) -print"

# Execute the find command
eval "$find_command" | while read -r file; do
    echo "Processing: $file"
    echo "$file:" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n" >> "$output_file"
done

echo "Merged files saved to $output_file"