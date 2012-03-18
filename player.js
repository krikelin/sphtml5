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
	this.node = document.createElement("tr");
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
Track.prototype = new Resource("","");
/*********
Creates a track from a json object
*/
function Track(uri) {
	
	this.album = uri.album;
	this.artist = uri.artist;
	this.uri = uri.href;
	this.duration = uri.duration;
	var tr = document.createElement("tr");
	tr.setAttribute("class", "track");
	
	var tdPlay = document.createElement("td");
	tdPlay.addEventListener("dblclick", function() {
		player.play(_this);
	});
	var tdTitle = document.createElement("td");
	var tdArtist = document.createElement("td");
	var tdAlbum = document.createElement("td");
	console.log(uri);
	tdTitle.innerHTML = uri.name;	
	tdArtist.innerHTML = uri.artists[0].name;
	tdAlbum.innerHTML = uri.album.name;
	tr.setAttribute("id", uri.uri);
	
	tr.appendChild(tdTitle);
	tr.appendChild(tdArtist);
	tr.appendChild(tdAlbum);
	this.node = tr;
	
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
		this.notify(Playlist.EVENT.TRACKSADDED, elm); 
	};
	/***
	Removes a track
	***/
	this.removeAt = function(index) {
		this.elements.splice(index, 1); // Remove the song at the index
		this.notify(Playlist.EVENT.TRACKSREMOVED, index);
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
	this.viewStack = [];
	this.createPlaylist	= function(title) {
		var pls = new Playlist(title);
		this.addPlaylist(pls);
	};
	this.addPlaylist = function(playlist) {
		this.playlists.add(playlist);
	};
	this.currentView = null;
	this.navigate = function(uri) {
		$(".sp-view").each(function(index) {
				$(this).hide();
		});
		for(var i = 0; i < this.viewStack.elements; i++) {
			var view = this.viewStack.elements[i];
			if(view.uri == uri) {
				this.currentView = view;
				$(view.node).show();
				return;
			}
		}
	
		// Otherwise create view
		var parameters = uri.split(":");
		if(parameters[1] == "search") {
			view = new SearchView(parameters[2]);
			
		}
		if(view != null) {
			this.viewStack.push(view);
			this.currentView = view;
			$("#container").append(view.node);
			
			$("#view_"+view.uri.replace(":","__")).show();
		}
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
	this.node.setAttribute("id","view_" + this.uri.replace(":","__"));
	
}

/***
Playlist view
****/
PlaylistView.prototype = new View("spotify:playlist:", "Untitled view");
function PlaylistView(title) {
	this.title = title;
	this.playlist = new Playlist(title);
	var node = this.node;
	this.playlist.observe(Playlist.EVENT.TRACKSREMOVED, function(track) {
		
		
	});
	
	this.playlist.observe(Playlist.EVENT.TRACKSREMOVED, function(uri) {
		var tbody = node.getElementsByTagName("tbody")[0];
		tbody.removeChild(tbody.getElementById(uri));
	});
	this.node = node;
	this.uri = "spotify:playlist:"+ encode(title);
	
}
PlaylistView.prototype.constructor = PlaylistView;

SearchView.prototype = new View("Search: ");
function SearchView(query) {
	this.title = query;
	this.query = query;
	this.uri = "spotify:search:" + query;
	this.node = document.createElement("div");
	this.node.setAttribute("class", "sp-view");
	this.node.setAttribute("id","view_" + this.uri.replace(":","__"));this.node = document.createElement("div");
	this.node.setAttribute("class", "sp-view");
	this.node.setAttribute("id","view_" + this.uri.replace(":","__"));
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	$.getJSON('http://ws.spotify.com/search/1/track?q=' + this.query, function(data) {
	  $.each(data.tracks, function(track) {
			var track = new Track(data.tracks[track]);
			tbody.appendChild(track.node);
	  });
	});
	this.node.appendChild(table);
	 
}
SearchView.prototype.constructor = SearchView;


// Updates the UI
this.updateUI = function() {
}