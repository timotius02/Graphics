## Online Command File to Animation Converter

### A Computer Graphics Final Project
### By Timotius Sitorus & Kevin Sun

####Demo: http://graphics3d.herokuapp.com/
To run demo click "Example" and then "Convert"

**Introduction**

Our project's goal is to migrate the command list program that 
we have created into the web through the use of *Javascript*
and *HTML5 Canvas*

In order to maintain the integrity of this project, we will use vanilla
javascript without the use of any external frameworks or packages. We will
also stay true to the format of the original command list program as much 
as we can, such as using triangles, backface-culling, perspectives, etc. 


**Client**

The way the client side will be structures is as follows

```	
		_______________________
	   |					   |
	   |					   |
	   |					   |
	   |					   |
	   |					   |
	   |	  **CANVAS**	   | 
	   |					   |
	   |					   |
	   |					   |
	   |_______________________|

	   	_______________________		 _______
	   |					   |	|Convert| 
	   |					   |	|_______|
	   |					   |
	   |					   |
	   |					   |
	   |	 **TEXT AREA**	   | 
	   |					   |
	   |					   |
	   |					   |
	   |_______________________|
```

The "command file" will be placed in the 
text area and then the user will press Convert.
The resulting animation will appear in the Canvas.

**List of Commands**

```

	TRIANGLES 3D COMMANDS
# Comment

frames first–frame last-frame
vary variable-name beginning-value ending-value start-frame end-frame

screen xleft ybottom xright ytop 
pixels width height 

box-t sx sy sz rx ry rz mx my mz 
sphere-t sx sy sz rx ry rz mx my m

identity 
move mx my mz 
scale sx sy sz 
rotate-x rx 
rotate-y ry 
rotate-z rz

save storage-name 
restore storage-name 

render-parallel s
render-perspective-cyclops eyex eyey eyez 
render-perspective-stereo left-eyex left-eyey left-eyez right-eyex 
						right-eyey right-eyez 

end 

	MISC COMMANDS
color r g b
line x1 y1 x2 y2
circle centerx centery centerz radius


& more will be added

```

**End Result**
- Finished basic graphics animation up to simple wireframe animations
- Interface allows for uploading command and import files
- Import command works
- Added motion controls through phone controls
- Added option to cotinue animation infinitely
- added example button to show quick example

