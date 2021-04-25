# Console

In addition to the admin dashboard, Bilpp provides several console commands to help manage your forum over the terminal.

To use the console:

1. `ssh` into the server where your bilpp installation is hosted
2. `cd` to the folder that contains a file called `bilpp`
3. Run the command via `php bilpp [command]`

## Default Commands

### list

Lists all available management commands, as well as instructions for using management commands

### help

`php bilpp help [command_name]`

Displays help output for a given command.

You can also output the help in other formats by using the --format option:

`php bilpp help --format=xml list`

To display the list of available commands, please use the list command.

### info

`php bilpp info`

Gather information about Bilpp's core and installed extensions. This is very useful for debugging issues, and should be shared when requesting support.

### cache:clear

`php bilpp cache:clear`

Clears the backend bilpp cache, including generated js/css, text formatter cache, and cached translations. This should be run after installing or removing extensions, and running this should be the first step when issues occur.

### migrate

`php bilpp migrate`

Runs all outstanding migrations. This should be used when an extension that modifies the database is added or updated.

### migrate:reset

`php bilpp migrate:reset --extension [extension_id]`

Reset all migrations for an extension. This is mostly used by extension developers, but on occasion, you might need to run this if you are removing an extension, and want to clear all of its data from the database. Please note that the extension in question must currently be installed (but not necessarily enabled) for this to work.
