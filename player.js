/***************
Event class
****************/
function Event(id, callback) {
	this.id = id;
	this.callback = callback;
}

/****************
Stack class
*****************/
function Queue() {
	this.elements = [];
	this.enqueue = function(elm) {
		this.elements.push(elm);
	};
	this.dequeue = function() {
		var elm = this.elements[0];
		this.elements.splice(0, 1); // Remove the first element
		return elm;
	};
	this.count = function() {
		return this.elements.length;
	};
	this.empty = function() {
		return this.elements.length == 0;
	};
}
/****
Stack class
****/
Stack.prototype = new Queue();
function Stack() {
	this.elements = [];
}
Stack.prototype.constructor = Stack;
Stack.prototype.push = function(elm) {
	this.elements.push(elm);
	
};
Stack.prototype.pop = function(elm) {
	var elm = this.elements[this.elements.length-1];
	this.elements.splice(this.elements[0].length-1, 1);
	return elm;
};


// A Spotify resource
function Resource(title, uri) {
	this.title = title;
	this.uri = uri;
	
	/****
	Notify about a new event
	@param evt The id of event to occur (Playlist.EVENT.TRACKSADDED for example)
	@param args A object passed to the event
	***/
	this.notify = function(evt, args) {
		for(var i = 0; i < this.events.length; i++) {
			if(this.events[i].id == evt) {
				this.events[i].callback(args, this);
			}
		}
	};
	this.events = [];
	/***
	Subscribe to a certain event
	@param event The id of event
	@param callback The callback of event
	***/
	this.observe = function(event, callback) {
		this.events.add = new Event(event, callback);
	};
}
/**
A Spotify Track 
**/
Track.prototype = new Resource();

function Track(title, artist, album, uri, duration) {
	this.uri = uri;
	this.album = album;
	this.artist = artist;
	this.duration = duration;
	
}
Track.prototype.constructor = Track;
Playlist.prototype = new Resource("","spotify:playlist");
/************
Playlist class
**************/
function Playlist(title) {
	this.title = title;
	this.uri = "spotify:playlist:" + encode(title);
	this.elements = []; // Elements
	this.add = function(elm) {
		this.elements.push(elm);
		this.notify(Playlist.EVENT.TRACKSADDED, 
	};
	this.removeAt = function(index) {
		this.elements.splice(index, 1); // Remove the song at the index
	}
	
	
};
Playlist.prototype.constructor = Playlist;
Playlist.EVENT = {
	TRACKADDED : 0x01,
	TRACKREMOVED : 0x02,
};
/*************
Player class
**/
function Player() {
	this.play = function(track, context) {
		this.track = track;
		this.context = context;
	};
	this.currentTrack = null;
	this.stop = function() {};
	this.playNext = function(){};
	this.rewind = function() {};
	this.fastForward = function() {};
	this.currentPlaylist = null;
	this.playlists = [];
	this.playQueue = new Queue();
	this.addPlaylist = function(playlist) {
		this.playlists.add(playlist);
	};
	this.history = new Stack();
	this.forward = new Stack();
	this.currentView = null;
	this.navigate = function(uri) {
		for(var i = 0; i < this.viewStack.elements; i++) {
		};
	};
}

/***
A certain view, like playlist, 
**/
function View(title) {
	this.node = function() {}; // an HTML element
	this.uri = "spotify:view:" + title; // URI of view
	this.title = title;
	this.node = document.createElement("div");
	this.node.setAttribute("class", "sp-view");
	this.node.setAttribute("id", uri.replace(":","__"));
}

/***
Playlist view
****/
PlaylistView.prototype = new View("spotify:playlist:", "Untitled view");
function PlaylistView(title) {
	this.title = title;
	this.playlist = new Playlist();
	this.playlist.observe(Playlist.EVENT.TRACKSREMOVED, function(track) {
		var tbody = this.node.getElementsByTagName("tbody")[0];
		var tr = document.createElement("tr");
		tr.setAttribute("class", "track");
		var tdTitle = document.createElement("td");
		var tdArtist = document.createElement("td");
		var tdAlbum = document.createElement("td");
		tdTitle.innerHTML = track.name;
		tdArtist.innerHTML = track.artist;
		tdAlbum.innerHTML = track.album;
		tr.setAttribute("id", track.uri.replace(":","_"));
		tbody.appendChild(tr);
		tr.appendChild(tdTitle);
		tr.appendChild(tdArtist);
		tr.appendChild(tdAlbum);
		
	});
	this.playlist.observe(Playlist.EVENT.TRACKSREMOVED, function(track) {
		var tbody = this.node.getElementsByTagName("tbody")[0];
		
		tr.setAttribute("id", track.uri.replace(":","_"));
	});
	this.uri = "spotify:playlist:"+ encode(title);
	
}
PlaylistView.prototype.constructor = PlaylistView;

SearchView.prototype = new View("Search: ");
function SearchView(query) {
	this.title = query;
	this.uri = "spotify:search:" + query;
}
SearchBiew.prototype.constructor = SearchView;


// Updates the UI
this.updateUI = function() {
}