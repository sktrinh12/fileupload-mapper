#!/bin/bash

# Split the current tmux window into two panes
tmux split-window -v -c './frontend' 'bash -i -c "export REACT_APP_VERSION=0.1 && export REACT_APP_ENVIRONMENT=DEVEL && npm run start"'

# Create a new window for the backend, change directory, activate virtual environment, and start backend server
tmux new-window -n 'backend' -c './backend'
tmux send-keys 'source venv/bin/activate' C-m
tmux send-keys 'python main.py' C-m

# Switch back to the first pane
tmux select-pane -t 0

# Attach to the tmux session to view the panes and windows
tmux attach-session
