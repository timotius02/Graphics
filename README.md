# Online Command File to Animation Conversion

### A Computer Graphics Final Project
### By Timotius Sitorus & Kevin Sun

**Introduction**

Our project's goal is to migrate the command list program that 
we have created into the web through the use of *Javascript*
and HTML5 *Canvas*

In order to maintain the integrity of this project, we will use vanilla
javascript without the use of any external frameworks or packages. We will
also stay true to the format of the original command list program as much 
as we can. 


**Client**

The way the client side will be structures is as follows

```		_______________________
	   |					   |
	   |					   |
	   |					   |
	   |					   |
	   |					   |
	   |					   | <-------Canvas
	   |					   |
	   |					   |
	   |					   |
	   |_______________________|

	   	_______________________		 _______
	   |					   |	|Convert| <---Convert Button
	   |					   |	|_______|
	   |					   |
	   |					   |
	   |					   |
	   |					   | <-------Text Area
	   |					   |
	   |					   |
	   |					   |
	   |_______________________|
```

The "command file" will be placed in the 
text area and then the user will press Convert.
The resulting animation will appear in the Canvas.

