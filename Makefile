# PACKAGES = argv box core fs logger ui
PACKAGES = argv core
PACKAGE_JSON_FILES = $(addsuffix /package.json,$(addprefix packages/,$(PACKAGES)))
CLEAN_TASKS = $(addprefix clean-,$(PACKAGES))

# executables
NODE = node
MK_PACKAGE = $(NODE) tools/bin/pack.js
COMPILE = $(NODE) tools/bin/compile.js

.PHONY: all tools clean $(PACKAGES) $(CLEAN_TASKS)

# recipe for making all package
all: $(PACKAGES)

# cleanup tasks
$(CLEAN_TASKS): clean-%:
	cd packages/$* && rm -rf dist && mkdir dist && rm -f package.json

clean: $(CLEAN_TASKS)

# recipe for all packages (listed in $(PACKAGES))
$(PACKAGES): %: packages/%/package.json
	$(COMPILE) $@

# recipe for package.json files
$(PACKAGE_JSON_FILES): packages/%/package.json: packages/%/package.template.json package.json
	$(MK_PACKAGE) package.json $< > $@

# compiling tools
tools:
	cd tools && rm -rf bin && ../node_modules/.bin/tsc
