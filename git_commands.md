# Git Command Reference Guide

This document lists all the Git commands used throughout the development of **Ethara Workspace**, explaining the exact purpose and context of each command.

---

## 1. Environment & Configuration Commands

### `git --version`
* **Purpose**: Checked if Git was installed on the system and verified its version.
* **Context**: Used to diagnose whether Git was available in the system shell before configuring repository properties.

### `git config --global user.name "itzzGunjan"`
* **Purpose**: Sets the global author name for Git commits to your GitHub username.
* **Context**: Configured before the first local commit to ensure correct identity tracking.

### `git config --global user.email "kumargunjan14062004@gmail.com"`
* **Purpose**: Sets the global author email for Git commits to your GitHub email address.
* **Context**: Paired with the user name command to authenticate the author.

---

## 2. Repository Initialization & Remote Configuration

### `git init`
* **Purpose**: Initializes a blank local Git repository inside the `ETHARA/` directory.
* **Context**: Set up local tracking of workspace directories so we could begin staging our files.

### `git remote add origin "https://itzzGunjan:<TOKEN>@github.com/itzzGunjan/Ethara-Workspace.git"`
* **Purpose**: Links the local Git repository to a remote repository on GitHub using a secure Personal Access Token (PAT) for inline command-line authentication.
* **Context**: Added to create the original link pointing to the initial repository target.

### `git remote -v`
* **Purpose**: Lists all active remote repository URLs configured for the project.
* **Context**: Used to verify that the credentials and URLs were correctly set before executing pushes.

### `git remote set-url origin "https://itzzGunjan:<TOKEN>@github.com/itzzGunjan/Ethara-ti.git"`
* **Purpose**: Modifies the remote repository URL to target a new repository name (`Ethara-ti`).
* **Context**: Executed when switching the target repository to your newly created blank repository `Ethara-ti`.

---

## 3. Staging & Committing Codebases

### `git branch -M main`
* **Purpose**: Renames the default local branch of the repository to `main`.
* **Context**: Run to match GitHub's default branch naming convention before performing the initial push.

### `git add <file_or_folder>`
* **Purpose**: Stages changes (creations, edits, deletions) to be included in the next commit.
* **Context**: Used at multiple stages:
  * `git add .gitignore` (to stage the initial ignore structure)
  * `git add .` (to stage the entire FastAPI backend and React frontend workspace)
  * `git add prompt.md` (to stage the creative brief)
  * `git add golden_response.py` (to stage the workspace builder script)
  * `git add justification.md` (to stage the final decision document)

### `git commit -m "<message>"`
* **Purpose**: Records a snapshot of the staged changes in the local repository history with a descriptive log message.
* **Context**: Used for saving progress (initial commits, feature setups, documentation edits, and structural refactorings).

---

## 4. Pushing, Pulling & Rebasing Code

### `git push -u origin main`
* **Purpose**: Uploads your local branch commits to the remote repository (`origin`) and sets up tracking link (`-u`) for the `main` branch.
* **Context**: Used for the first upload of the repository codebase.

### `git push`
* **Purpose**: Uploads local branch commits to the remote repository once the tracking branch is set up.
* **Context**: Used to upload follow-up commits (such as adding files, untracking files, or adding documentation).

### `git pull --rebase origin main`
* **Purpose**: Fetches the latest commits from the remote repository and replays your local commits on top of them.
* **Context**: Executed to avoid merge conflicts and keep a clean, linear git history when the remote repository was updated with commits not present in the local history.

---

## 5. Advanced File Index Manipulation

### `git rm --cached prompt.md`
* **Purpose**: Untracks a file from the repository index while keeping the actual file completely safe on your local computer.
* **Context**: Executed when you requested to remove `prompt.md` from the public GitHub repository while keeping it private in your local folder. After executing this and pushing, the file was safely deleted from GitHub but remained untouched on your desktop.
