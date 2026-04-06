.PHONY: web-dev backend-run help

help:
	@echo "NexusPlane Workspace"
	@echo "===================="
	@echo "make web-dev     : Khởi chạy Next.js Frontend Development Server"
	@echo "make backend-run : Khởi chạy Go Backend Control Plane"

web-dev:
	@echo "Starting NexusPlane Web UI..."
	cd web && npm run dev

backend-run:
	@echo "Starting NexusPlane Backend..."
	go run cmd/nexus/main.go
