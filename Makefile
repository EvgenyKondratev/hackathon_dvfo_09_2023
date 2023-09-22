all:
	@echo "make run                 - Create & run environment in terminal (realtime)"
	@echo "make up                  - Create & run environment as background process"
	@echo "make stop                - Stops docker containers and delete them"
	@echo "make clean               - Clean docker volumes"
	@exit 0


_clean_makefile:
	rm -fr *.egg-info dist
    
_down_docker:
	-docker-compose -f docker-compose.yml down --remove-orphans

run:
	docker-compose -f docker-compose.yml up --build

up:
	docker-compose -f docker-compose.yml up --build -d

stop: _down_docker _clean_makefile

clean:
	docker volume prune