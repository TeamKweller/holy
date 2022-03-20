cmake_minimum_required(VERSION 3.10)

# set the project name
project(client VERSION 1.0)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

set(CMAKE_CXX_FLAGS "-Wall -Wextra")
set(CMAKE_CXX_FLAGS_DEBUG "-g")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

file(GLOB_RECURSE sources ${PROJECT_SOURCE_DIR} ./source/*.cpp)

add_executable(client ${sources})
set_target_properties(client PROPERTIES LINK_FLAGS "--bind -s FETCH")