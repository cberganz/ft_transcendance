# VARIABLES

COMPOSE=docker-compose -p transcendance

# GENERAL RULES

all: data build up

re: fclean volume_rm all

# DOCKER RULES

build:
	${COMPOSE} build

up:
	${COMPOSE} up

stop:
	${COMPOSE} stop

ps:
	docker ps

# CLEAN RULES

fclean: clean prune

clean:
	${COMPOSE} down

volume_rm:
	docker volume rm transcendance_db-volume

prune:
	docker system prune -a --force
	docker volume prune --force
	docker network prune --force

.PHONY: all re data build up stop ps clean fclean volume_rm prune
