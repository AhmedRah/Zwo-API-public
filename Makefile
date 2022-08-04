DOCKER_COMPOSE	= @docker-compose

#-------------------#
#    HELP           #
#-------------------#

.PHONY:				help
.DEFAULT_GOAL 		= help

help:	## DEFAULT_GOAL : Display help messages for child Makefile
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


#-------------------#
#    CONTAINERS   	#
#-------------------#

.PHONY:	info start stop reload build restart logs node

start: 	## Start containers with default docker-compose.yml file
	$(DOCKER_COMPOSE) up --remove-orphans -d

stop:	## Stopping containers
	$(DOCKER_COMPOSE) down --remove-orphans

restart:	## Restart containers
	$(DOCKER_COMPOSE) restart

build:	## Build containers
	$(DOCKER_COMPOSE) build

logs:	## Show logs for all or c=<name> containers
	$(DOCKER_COMPOSE) logs --tail=100 -f $(c)

node:   ## Execute node container
	$(DOCKER_COMPOSE) exec -T api sh -c $(c)

test:   ## Execute test
	$(DOCKER_COMPOSE) exec -T api sh -c "npm run test"

lint-check: ## Lint and check code style
	$(DOCKER_COMPOSE) exec -T api sh -c "npm run lint:check"
