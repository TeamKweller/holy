#pragma once
#include <emscripten/fetch.h>
#include <functional>
#include <string>

void fetch(std::string url, emscripten_fetch_attr_t attribute, std::function<void(emscripten_fetch_t*)> then, std::function<void(emscripten_fetch_t*)> except);
emscripten_fetch_attr_t new_fetch_attribute();