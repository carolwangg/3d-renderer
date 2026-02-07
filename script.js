// --------------------SHAPES CLASSES---------------------------------
class Colour{
	constructor(r, g, b){
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

class Coordinate{
	
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	translate(vector){
		this.x += vector.x;
		this.y += vector.y;
	}
	
	copy(){
		return new Coordinate(this.x, this.y);
	}
}

class Point{
	
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
	translate(vector){
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}
	
	getRotatedXZ(theta){
		let prevX = this.x;
		let prevZ = this.z;
		const rotatedX = prevX*Math.cos(theta) - prevZ*Math.sin(theta);
		const rotatedZ = prevX*Math.sin(theta) + prevZ*Math.cos(theta);
		return new Point(rotatedX, this.y, rotatedZ);
	}
	
	getRotatedYZ(theta){
		let prevX = this.x;
		let prevY = this.y;
		const rotatedX = prevX*Math.cos(theta) - prevY*Math.sin(theta);
		const rotatedY = prevX*Math.sin(theta) + prevY*Math.cos(theta);
		return new Point(rotatedX, rotatedY, this.z);
	}
	
	rotateXZ(theta){
		let prevX = this.x;
		let prevZ = this.z;
		this.x = prevX*Math.cos(theta) - prevZ*Math.sin(theta);
		this.z = prevX*Math.sin(theta) + prevZ*Math.cos(theta);
	}
	rotateYX(theta){
		let prevX = this.x;
		let prevY = this.y;
		this.x = prevX*Math.cos(theta) - prevY*Math.sin(theta);
		this.y = prevX*Math.sin(theta) + prevY*Math.cos(theta);
	}
	
	getDifferenceVector(comparisonPoint){
		return new Point(comparisonPoint.x - this.x, comparisonPoint.y - this.y, comparisonPoint.z - this.z);
	}
	
	normalize(){
		const length = Math.sqrt(this.x**2 + this.y**2 + this.z**2);
		return new Point((this.x / length).toFixed(2), (this.y / length).toFixed(2), (this.z / length).toFixed(2));
	}
	
	cross(comparisonPoint){		
		const normalX = this.y*comparisonPoint.z - this.z*comparisonPoint.y;
		const normalY = -this.x*comparisonPoint.z + this.z*comparisonPoint.x;
		const normalZ = this.x*comparisonPoint.y - this.y*comparisonPoint.x;
		
		return new Point(normalX, normalY, normalZ);
	}
	
	dot(comparisonPoint){				
		return this.x*comparisonPoint.x+this.y*comparisonPoint.y+this.z*comparisonPoint.z;
	}
	
	flip(){
		return new Point(-this.x, -this.y, -this.z);
	}
	
	length(){
		return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
	}
	
	rotateAroundPointXZ(point, theta){
		const vector = point.getDifferenceVector(this);
		vector.rotateXZ(theta);
		this.x = vector.x + point.x;
		this.y = vector.y + point.y;
		this.z = vector.z + point.z;
	}
	
	rotateAroundPointYX(point, theta){
		const vector = point.getDifferenceVector(this);
		vector.rotateYX(theta);
		this.x = vector.x + point.x;
		this.y = vector.y + point.y;
		this.z = vector.z + point.z;
	}
	
	copy(){
		return new Point(this.x, this.y, this.z);
	}
	
	toString(){
		return `(${this.x},${this.y},${this.z})`
	}
}

class Line{
	constructor(startPoint, endPoint){
		this.start = startPoint;
		this.end = endPoint;
	}
	translate(vector){
		this.start.translate(vector);
		this.end.translate(vector);
	}
	rotateXZ(theta){
		this.start.rotateXZ(theta);
		this.end.rotateXZ(theta);
	}
	rotateYX(theta){
		this.start.rotateYX(theta);
		this.end.rotateYX(theta);
	}
}

class Polygon{
	constructor(points, colour){
		this.points = points;
		this.colour = colour;
	}
	
	add(point){
		this.points.push(point);
	}
	translate(vector){
		for(point of this.points){
			point.translate(vector);
		}
	}
	rotateXZ(theta){
		for(point of this.points){
			point.rotateXZ(theta);
		}
	}
	rotateYX(theta){
		for(point of this.points){
			point.rotateYZ(theta);
		}
	}
	getDifferenceVector(comparisonPoint){
		if (this.points.length > 0){
			
			return this.points[0].getDifferenceVector(comparisonPoint);
		}
		return comparisonPoint;
	}
	getNormalizedNormal(){
		/* Assumes that the face is flat.
		*/
		if (this.points.length > 2){
			const vector1 = this.points[0].getDifferenceVector(this.points[1]);
			const vector2 = this.points[1].getDifferenceVector(this.points[2]);
			const normal = vector2.cross(vector1).normalize();
			return normal;
		}
		return new Point(0, 0, 0);
	}
}

// --------------------RENDERED SPECIFIC CLASSES---------------------------------

class Camera{
	constructor(x, y, z, angle){
		this.point = new Point(x, y, z);
		this.angle = angle;
	}
	rotate(dTheta){
		this.angle += dTheta;
	}
	stepForward(dStep){
		this.point.z += dStep * Math.cos(this.angle);
		this.point.x += dStep * Math.sin(this.angle);
	}
	stepBackwards(dStep){
		this.point.z -= dStep * Math.cos(this.angle);
		this.point.x -= dStep * Math.sin(this.angle);
	}
	stepLeft(dStep){
		this.point.z += dStep * Math.cos(this.angle - Math.PI/2);
		this.point.x += dStep * Math.sin(this.angle - Math.PI/2);
	}
	stepRight(dStep){
		this.point.z += dStep * Math.cos(this.angle + Math.PI/2);
		this.point.x += dStep * Math.sin(this.angle + Math.PI/2);
	}
}

// -----------------------3D OBJECTS CLASSES------------------------------------
class Shape{
	constructor(points, edges, faces){
		this.points = points;
		this.edges = edges;
		this.faces = faces;
	}
}
class Cube extends Shape{
	constructor(centre, side_length){
		const front_top_right =	new Point(side_length/2 + centre.x, side_length/2 + centre.y, centre.z - side_length/2);
		const front_top_left =	new Point(-side_length/2 + centre.x, side_length/2 + centre.y, centre.z - side_length/2);
		const front_bottom_left =	new Point(-side_length/2 + centre.x, -side_length/2 + centre.y, centre.z - side_length/2);
		const front_bottom_right =	new Point(side_length/2 + centre.x, -side_length/2 + centre.y, centre.z - side_length/2);
		const back_top_right =	new Point(side_length/2 + centre.x, side_length/2 + centre.y, centre.z + side_length/2);
		const back_top_left =	new Point(-side_length/2 + centre.x, side_length/2 + centre.y, centre.z + side_length/2);
		const back_bottom_left =	new Point(-side_length/2 + centre.x, -side_length/2 + centre.y, centre.z + side_length/2);
		const back_bottom_right =	new Point(side_length/2 + centre.x, -side_length/2 + centre.y, centre.z + side_length/2);
		
		const points = [
			front_top_right,
			front_top_left,
			front_bottom_left,
			front_bottom_right,
			back_top_right,
			back_top_left,
			back_bottom_left,
			back_bottom_right
		]
		
		const edges = [
			new Line(front_top_right, front_top_left),
			new Line(front_top_left, front_bottom_left),
			new Line(front_bottom_left, front_bottom_right),
			new Line(front_bottom_right, front_top_right),
			new Line(back_top_right, back_top_left),
			new Line(back_top_left, back_bottom_left),
			new Line(back_bottom_left, back_bottom_right),
			new Line(back_bottom_right, back_top_right),
			new Line(back_top_right, front_top_right),
			new Line(back_top_left, front_top_left),
			new Line(back_bottom_left, front_bottom_left),
			new Line(back_bottom_right, front_bottom_right),
		]
		
		const faces = [
			new Polygon([front_top_right, front_top_left, front_bottom_left, front_bottom_right], CUBE_COLOUR),
			new Polygon([back_bottom_left, back_top_left, back_top_right, back_bottom_right], CUBE_COLOUR),
			new Polygon([back_top_right, front_top_right, front_bottom_right, back_bottom_right], CUBE_COLOUR),
			new Polygon([front_top_right, back_top_right, back_top_left, front_top_left], CUBE_COLOUR),
			new Polygon([front_top_left, back_top_left, back_bottom_left, front_bottom_left], CUBE_COLOUR),
			new Polygon([front_bottom_left, back_bottom_left, back_bottom_right, front_bottom_right], CUBE_COLOUR),
		]
		
		super(points, edges, faces);
		this.centre = centre;

	}
}

class SquareBasePyramid extends Shape{
	constructor(base_centre, base_side_length, height, colour=PYRAMID_COLOUR){
		const vertex =	new Point(base_centre.x, height/2 + base_centre.y, base_centre.z);
		const base_top_left =	new Point(-base_side_length/2 + base_centre.x, -height/2 + base_centre.y, base_centre.z + base_side_length/2);
		const base_top_right =	new Point(base_side_length/2 + base_centre.x, -height/2 + base_centre.y, base_centre.z + base_side_length/2);
		const base_bottom_left =	new Point(-base_side_length/2 + base_centre.x, -height/2 + base_centre.y, base_centre.z - base_side_length/2);
		const base_bottom_right =	new Point(base_side_length/2 + base_centre.x, -height/2 + base_centre.y, base_centre.z - base_side_length/2);
		const points = [
			vertex,
			base_top_left,
			base_top_right,
			base_bottom_left,
			base_bottom_right
		];
		const edges = [
			new Line(vertex, base_top_left),
			new Line(vertex, base_top_right),
			new Line(vertex, base_bottom_left),
			new Line(vertex, base_bottom_right),
			new Line(base_top_left, base_top_right),
			new Line(base_top_right, base_bottom_right),
			new Line(base_bottom_right, base_bottom_left),
			new Line(base_bottom_left, base_top_left),
		];
		const faces = [
			new Polygon([vertex, base_bottom_left, base_bottom_right], colour),
			new Polygon([vertex, base_bottom_right, base_top_right], colour),
			new Polygon([vertex, base_top_right, base_top_left], colour),
			new Polygon([vertex, base_top_left, base_bottom_left], colour),
			new Polygon([base_bottom_right, base_bottom_left, base_top_left, base_top_right], colour)
		];
		super(points, edges, faces);
		this.centre = base_centre;
		this.base_side_length = base_side_length;
		this.height = height;
	}
	
}
// -----------------------------------------------------------------------------


const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const CANVAS_WIDTH = c.width;
const CANVAS_HEIGHT = c.height;
const CANVAS_COLOUR = "white";
const VIEW_DISTANCE = 500; //for some reason this is like the only one that works ...
const POINT_WIDTH = 5;
const POINT_COLOUR = "red";
const FILL_COLOUR = "red";
const TEXT_COLOUR = "black";
const SHOW_POINTS = false;
const RENDER_FACES = true; //lighting

const FPS = 10;
const keys = new Set();

const ORIGIN = new Point(0, 0, 0);
const LIGHT_SOURCE = new Point(100, 100, 200);
const LIGHT_SOURCE_RANGE = 1000; // how far the light reaches
const camera = new Camera(0, 0, 0, 0); //camera x, y, z, angle

const ROOM_WIDTH = 2000;
const ROOM_OFFSET_Z = 0;
const ROOM_OFFSET_X = 0;
const ROOM_OFFSET_Y = 0;

const room_front_top_right =	new Point(ROOM_WIDTH/2 + ROOM_OFFSET_X, ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z - ROOM_WIDTH/2);
const room_front_top_left =	new Point(-ROOM_WIDTH/2 + ROOM_OFFSET_X, ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z - ROOM_WIDTH/2);
const room_front_bottom_left =	new Point(-ROOM_WIDTH/2 + ROOM_OFFSET_X, -ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z - ROOM_WIDTH/2);
const room_front_bottom_right =	new Point(ROOM_WIDTH/2 + ROOM_OFFSET_X, -ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z - ROOM_WIDTH/2);
const room_back_top_right =	new Point(ROOM_WIDTH/2 + ROOM_OFFSET_X, ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z + ROOM_WIDTH/2);
const room_back_top_left =	new Point(-ROOM_WIDTH/2 + ROOM_OFFSET_X, ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z + ROOM_WIDTH/2);
const room_back_bottom_left =	new Point(-ROOM_WIDTH/2 + ROOM_OFFSET_X, -ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z + ROOM_WIDTH/2);
const room_back_bottom_right =	new Point(ROOM_WIDTH/2 + ROOM_OFFSET_X, -ROOM_WIDTH/2 + ROOM_OFFSET_Y, ROOM_OFFSET_Z + ROOM_WIDTH/2);

ROOM_COLOUR = new Colour(100, 100, 100);
const room = {
	"points":[
		room_front_top_right,
		room_front_top_left,
		room_front_bottom_left,
		room_front_bottom_right,
		room_back_top_right,
		room_back_top_left,
		room_back_bottom_left,
		room_back_bottom_right
	],
	"edges":[
		new Line(room_back_top_right, room_back_top_left),
		new Line(room_back_top_left, room_back_bottom_left),
		new Line(room_back_bottom_left, room_back_bottom_right),
		new Line(room_back_bottom_right, room_back_top_right),
		new Line(room_back_top_right, room_front_top_right),
		new Line(room_back_top_left, room_front_top_left),
		new Line(room_back_bottom_left, room_front_bottom_left),
		new Line(room_back_bottom_right, room_front_bottom_right),
	],
	"faces":[
		new Polygon([room_back_bottom_right, room_back_top_right, room_back_top_left,room_back_bottom_left], ROOM_COLOUR),
		new Polygon([room_back_bottom_right, room_front_bottom_right, room_front_top_right, room_back_top_right], ROOM_COLOUR),
		new Polygon([room_front_top_left, room_back_top_left, room_back_top_right, room_front_top_right], ROOM_COLOUR),
		new Polygon([room_front_bottom_left, room_back_bottom_left, room_back_top_left, room_front_top_left], ROOM_COLOUR),
		new Polygon([room_front_bottom_right, room_back_bottom_right, room_back_bottom_left, room_front_bottom_left], ROOM_COLOUR),
	]
};

const CUBE_WIDTH = 1000;
const CUBE_OFFSET_X = 0;
const CUBE_OFFSET_Y = 0;
const CUBE_OFFSET_Z = 2000;
const CUBE_COLOUR = new Colour(0, 255, 0);
const cube = new Cube(new Point(CUBE_OFFSET_X, CUBE_OFFSET_Y, CUBE_OFFSET_Z), CUBE_WIDTH);

const HEIGHT = 200;
const BASE_SIDE_LENGTH = 200;
const PYRAMID_OFFSET_X = 0;
const PYRAMID_OFFSET_Y = 100;
const PYRAMID_OFFSET_Z = 100;
const PYRAMID_COLOUR = new Colour(255, 255, 0);
const pyramid = new SquareBasePyramid(new Point(PYRAMID_OFFSET_X, PYRAMID_OFFSET_Y, PYRAMID_OFFSET_Z), BASE_SIDE_LENGTH, HEIGHT);

const points_to_track = new Map(
	[
		["camera", camera.point],
		["light", LIGHT_SOURCE]	
	]
);
for (point of cube.points){
	points_to_track.set(`cube ${point}`, point);
}
for (point of pyramid.points){
	points_to_track.set(`pyramid ${point}`, point);
}


function translateShape(shape, translationPoint){
	for (const point of shape.points){
		point.translate(translationPoint);
	}
}

function rotateShape(shape, rotationTheta, rotationPhi, centre=ORIGIN){
	// if centre == null, will rotate around origin (0, 0, 0). else, rotate around <centre>, shape's own centre.
	for (const point of shape.points){
		point.rotateAroundPointXZ(centre, rotationTheta);
	}
	for (const point of shape.points){
		point.rotateAroundPointYX(centre, rotationPhi);
	}
}

//viewer centred at (0, 0)
function toCanvas(x, y){
	return [x + CANVAS_WIDTH/2, -y + CANVAS_HEIGHT/2]
}

function project(x, y, z){
	xProjected = VIEW_DISTANCE*x/(z+VIEW_DISTANCE);
	yProjected = VIEW_DISTANCE*y/(z+VIEW_DISTANCE);
	return [xProjected, yProjected]
}

function drawPoint(x, y, fillStyle=null){
	if (fillStyle){
		ctx.fillStyle = fillStyle;
	}else{
		ctx.fillStyle = POINT_COLOUR;
	}
	ctx.fillRect(x - POINT_WIDTH/2, y - POINT_WIDTH/2, POINT_WIDTH, POINT_WIDTH);
}

function drawLine(startX, startY, endX, endY){
	ctx.strokeStyle = POINT_COLOUR;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
}

function drawText(msg, x, y){
	ctx.fillStyle = "black";
	ctx.font = "48px";
	ctx.fillText(msg, x, y);
}
function drawPolygon(points, fillStyle=null, borderStyle=null){
	if (points.length > 0){
		if (fillStyle){
			ctx.fillStyle = fillStyle;
		}else{
			ctx.fillStyle = FILL_COLOUR;
		}
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (let i = 1; i < points.length; i++){
			ctx.lineTo(points[i][0], points[i][1]);
		}
		ctx.fill();
		if (borderStyle) {
			ctx.strokeStyle = borderStyle;
			ctx.closePath();
			ctx.stroke();
		}
	}
}

function fromCamera(point){
	return [point.x - camera.point.x, point.y - camera.point.y, point.z - camera.point.z];
}

function transformPoint(point){
	/*
		Transform point from absolute coordinate system to relative to camera coordinates. Return the point.
	*/
	const transformedPoint = (new Point(camera.point.x, camera.point.y, camera.point.z)).getDifferenceVector(point);
	transformedPoint.rotateAroundPointXZ(new Point(0, 0, 0), camera.angle);
	return transformedPoint;
}
function drawProjectedPoint(point, fillStyle=null){
	const transformedPoint = transformPoint(point);
	if (transformedPoint.z < 0){ return; } //if behind camera, don't render
	const [projectedX, projectedY] = project(transformedPoint.x, transformedPoint.y, transformedPoint.z);
	const [canvasX, canvasY] = toCanvas(projectedX, projectedY);
	drawPoint(canvasX, canvasY, fillStyle);
	if (SHOW_POINTS) ctx.fillText(`x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)}, z: ${point.z.toFixed(2)}`, canvasX, canvasY);
}

function drawProjectedLine(line){
	const transformedPointStart = transformPoint(line.start);
	const [projectedXStart, projectedYStart] = project(transformedPointStart.x, transformedPointStart.y, transformedPointStart.z);
	const [canvasXStart, canvasYStart] = toCanvas(projectedXStart, projectedYStart);
	
	
	const transformedPointEnd = transformPoint(line.end);
	const [projectedXEnd, projectedYEnd] = project(transformedPointEnd.x, transformedPointEnd.y, transformedPointEnd.z);
	const [canvasXEnd, canvasYEnd] = toCanvas(projectedXEnd, projectedYEnd);
	if (SHOW_POINTS){
		/*ctx.fillText(`x: ${line.start.toFixed(2)}, y: ${line.start.toFixed(2)}`, startCoor.x, startCoor.y);
		ctx.fillText(`x: ${line.start.toFixed(2)}, y: ${line.start.toFixed(2)}`, endCoor.x, endCoor.y);*/
	}
	if (transformedPointStart.z < 0 && transformedPointEnd.z < 0){ return; } //if points behind camera, don't render
	drawLine(canvasXStart, canvasYStart, canvasXEnd, canvasYEnd);
}

function lightToColour(colour, light){
	return `rgb(${(light*colour.r).toFixed(0)}, ${(light*colour.g).toFixed(0)}, ${(light*colour.b).toFixed(0)})`;
}

function drawProjectedPolygon(polygon, showBack=false){
	const points = [];
	for (point of polygon.points){
		const transformedPoint = transformPoint(point);
		const [projectedX, projectedY] = project(transformedPoint.x, transformedPoint.y, transformedPoint.z);
		const [canvasX, canvasY] = toCanvas(projectedX, projectedY);
		points.push([canvasX, canvasY]);
		/*if (SHOW_POINTS) ctx.fillText(`x: ${projectedX.toFixed(2)}, y: ${projectedY.toFixed(2)}`, canvasX, canvasY);*/
	}
	
	const normal = polygon.getNormalizedNormal();

	const lightSourceVector = polygon.getDifferenceVector(LIGHT_SOURCE);
	const lightSourceNormalizedVector = lightSourceVector.normalize().flip(); //value 0-1;

	let distanceAdjustment;
	if (lightSourceVector.length() > 0){
		distanceAdjustment = (LIGHT_SOURCE_RANGE - lightSourceVector.length())/ LIGHT_SOURCE_RANGE;
	}else{
		distanceAdjustment = 0;
	}
	const light = 1.5*normal.dot(lightSourceNormalizedVector)*distanceAdjustment; //value 0-1;
	

	const adjustedLight = Math.max(light, 0.3);
	const transformedPoint = transformPoint(polygon.points[0]);

	if (showBack || transformedPoint.z > 0.1){
		drawPolygon(points, lightToColour(polygon.colour, adjustedLight));
	}
	if (SHOW_POINTS) drawProjectedLine(new Line(new Point(polygon.points[0].x, polygon.points[0].y, polygon.points[0].z), new Point(polygon.points[0].x + 50*normal.x, polygon.points[0].y+ 50*normal.y, polygon.points[0].z+ 50*normal.z)));
}

function drawShape(shape){
	if (SHOW_POINTS){
		for (const point of shape.points){
			drawProjectedPoint(point);
		}
	}		
	for (const edge of shape.edges){
		drawProjectedLine(edge);
	}
	if (RENDER_FACES){
		for (const face of shape.faces){
			drawProjectedPolygon(face);
		}
	}
}

function drawLight(){
	drawProjectedPoint(LIGHT_SOURCE, "yellow");
}
function draw(){
	const dz = 0;
	const dTheta = 0.1;
	const dPhi = 0.05;
	rotateShape(cube, dTheta, dPhi, cube.centre);
	rotateShape(pyramid, dTheta, 0);
	drawShape(room);
	drawShape(cube);
	drawShape(pyramid);
	drawLight();
}

function clear(){
	ctx.fillStyle = CANVAS_COLOUR;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function main(){
	clear();
	draw();
	drawMap();
	setTimeout(main, 1000/FPS);
}

function keyDown(event) {
	keys.add(event.code);
	moveCamera();
}

function keyUp(event) {
	keys.delete(event.code);
}

function moveCamera(){
	const dMove = 10;
	const dAngle = 0.1; //in radians
	for (const key of keys){

	}
	if (keys.has("ArrowUp")) camera.stepForward(dMove);
	if (keys.has("ArrowDown")) camera.stepBackwards(dMove);
	if (keys.has("ArrowLeft")) camera.stepLeft(dMove);
	if (keys.has("ArrowRight")) camera.stepRight(dMove);
	if (keys.has("KeyA")) camera.rotate(-dAngle);
	if (keys.has("KeyD")) camera.rotate(dAngle);
	/*if (eventCode === "KeyS") camera.rotate(-dAngle);
	if (eventCode === "KeyW") camera.rotate(-dAngle);*/
}

function drawMap(){
	const REFERENCE_WIDTH = 10*CANVAS_WIDTH;
	const MAP_WIDTH = 150;
	const MAP_START_X = 600;
	const MAP_START_Y = 600;
	const MAP_CENTRE_X = MAP_START_X + MAP_WIDTH/2;
	const MAP_CENTRE_Y = MAP_START_Y + MAP_WIDTH/2;
	drawPolygon([[MAP_START_X, MAP_START_Y], [MAP_START_X+MAP_WIDTH, MAP_START_Y],[MAP_START_X+MAP_WIDTH,MAP_START_Y+MAP_WIDTH], [MAP_START_X, MAP_START_Y+MAP_WIDTH]], "white", "black");
	drawLine(MAP_CENTRE_X, MAP_START_Y, MAP_CENTRE_X, MAP_START_Y+MAP_WIDTH);
	drawLine(MAP_START_X, MAP_CENTRE_Y, MAP_START_X+MAP_WIDTH, MAP_CENTRE_Y);
	
	let points_outside_reference = 0;
	for (const key of points_to_track.keys()){
		if (Math.abs(points_to_track.get(key).x/REFERENCE_WIDTH) > 0.5 || Math.abs(points_to_track.get(key).z/REFERENCE_WIDTH) > 0.5){
			drawText("Points outside reference!", MAP_START_X, MAP_START_Y - 10);
			drawText(key, MAP_START_X, MAP_START_Y - (10)*(points_outside_reference+2));
			points_outside_reference++;
		}
		drawPoint(MAP_WIDTH*points_to_track.get(key).x/REFERENCE_WIDTH + MAP_CENTRE_X, -MAP_WIDTH*points_to_track.get(key).z/REFERENCE_WIDTH + MAP_CENTRE_Y)
	}
	//draw camera angle

	const CAMERA_X = MAP_WIDTH*camera.point.x/REFERENCE_WIDTH + MAP_CENTRE_X;
	const CAMERA_Y = -MAP_WIDTH*camera.point.z/REFERENCE_WIDTH + MAP_CENTRE_Y;
	drawLine(CAMERA_X, CAMERA_Y, CAMERA_X+20*Math.sin(camera.angle), CAMERA_Y - 20*Math.cos(camera.angle))
}
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
main();

/*function rotateAroundPointXZ(point1, point, theta){
	const vector = point1.getDifferenceVector(point);
	console.log(`vector:(${vector.x}, ${vector.y}, ${vector.z})`)

	vector.rotateXZ(-theta);

	point1.x = vector.x + point.x;
	point1.y = vector.y + point.y;
	point1.z = vector.x + point.z;

}*/

/*zero = new Point(0, 0, 0);
x = new Point(0, 0, 1);
rotateAroundPointXZ(x, zero, 1);
*/
