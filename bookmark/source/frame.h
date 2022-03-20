#pragma once
#include <emscripten/bind.h>

class Frame {
private:
	emscripten::val document;
	emscripten::val frame;
public:
	Frame();
	void load_html(std::string html);
	void load(std::string href);
	void on_error();
	void display_error(std::string title, std::string message, std::string code);
};