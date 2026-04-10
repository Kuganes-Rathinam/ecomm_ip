@echo off
REM ============================================================
REM  EBS Microservices — Start All Services (Windows)
REM  Run this script from c:\dbms_project\microservices\
REM  Requires: Java 17+, Maven 3.6+, MongoDB running on :27017
REM ============================================================

echo.
echo ==========================================
echo  EBS Microservices Startup
echo ==========================================
echo  Make sure MongoDB is running on localhost:27017
echo  before proceeding!
echo ==========================================
echo.

set MICRO_ROOT=%~dp0

echo [1/6] Starting Eureka Server (port 8761)...
start "Eureka Server" cmd /k "cd /d %MICRO_ROOT%eureka-server && mvn spring-boot:run"

echo Waiting 20 seconds for Eureka to be ready...
timeout /t 20 /nobreak > nul

echo [2/6] Starting User Service (port 8081)...
start "User Service" cmd /k "cd /d %MICRO_ROOT%user-service && mvn spring-boot:run"

echo [3/6] Starting Catalog Service (port 8082)...
start "Catalog Service" cmd /k "cd /d %MICRO_ROOT%catalog-service && mvn spring-boot:run"

echo Waiting 20 seconds for core services to register with Eureka...
timeout /t 20 /nobreak > nul

echo [4/6] Starting Cart Service (port 8083)...
start "Cart Service" cmd /k "cd /d %MICRO_ROOT%cart-service && mvn spring-boot:run"

echo Waiting 15 seconds for cart-service to register...
timeout /t 15 /nobreak > nul

echo [5/6] Starting Order-Payment Service (port 8084)...
start "Order-Payment Service" cmd /k "cd /d %MICRO_ROOT%order-payment-service && mvn spring-boot:run"

echo Waiting 20 seconds for all services to register...
timeout /t 20 /nobreak > nul

echo [6/6] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd /d %MICRO_ROOT%api-gateway && mvn spring-boot:run"

echo.
echo ==========================================
echo  All services are starting up!
echo ==========================================
echo.
echo  Eureka Dashboard:   http://localhost:8761
echo  API Gateway:        http://localhost:8080
echo  User Service:       http://localhost:8081
echo  Catalog Service:    http://localhost:8082
echo  Cart Service:       http://localhost:8083
echo  Order+Payment:      http://localhost:8084
echo.
echo  The React frontend can now connect to http://localhost:8080
echo  (same URL as the original monolith — no frontend changes needed)
echo.
echo ==========================================
pause
