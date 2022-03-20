#pragma once
#include <emscripten/bind.h>
#include <functional>

class Frame {
private:
	emscripten::val document;
	emscripten::val frame;
public:
	Frame(std::function<void(bool)> load_callback);
	std::function<void(bool)> load_callback;
	void load_html(std::string html);
	void load(std::string href);
	void display_error(std::string title, std::string message, std::string code);
};