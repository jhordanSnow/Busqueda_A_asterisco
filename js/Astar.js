    var redraw;
    var height = 520;
    var width = 1020;
        
        window.onload = function() {
            var render = function(r, n) {
                    var set = r.set().push(
                        r.rect(n.point[0]-30, n.point[1]-13, 60, 44).attr({"fill": "#eee", r : "30px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
                        r.text(n.point[0], n.point[1] + 10, (n.label || n.id)));
                    return set;
                };

            
            var g = new Graph();
            
            var layouter = new Graph.Layout.Spring(g);
            layouter.layout();
            var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);
            
            //dijkstra(g, g.nodes[1]);
            
            renderer.draw();
            redraw = function() {
                for(e in g.edges) {
                    g.edges[e].style.label = g.edges[e].weight;
                    g.edges[e].style.directed = true;
                    
                    if(g.edges[e].target.predecessor === g.edges[e].source || g.edges[e].source.predecessor === g.edges[e].target) {
                        g.edges[e].style.stroke = "#bfa";
                        g.edges[e].style.fill = "#56f";
                    } else {
                        g.edges[e].style.stroke = "#666";
                    }
                }
                
                layouter.layout();
                renderer.draw();
            };

    jQuery("#uploadGraph").change(function (e){
        if (e.target.files.length <= 0) return false;
        var file = e.target.files[0];

        var fr = new FileReader();
        fr.onload = function(e) { 
            console.log(e);
            var result = JSON.parse(e.target.result);
            jQuery.each(result.names, function (index, value){
                g.addNode(value, {render:render});
            });

            jQuery.each(result.directions, function (i, fromNode){
                var from = fromNode.from;
                jQuery.each(fromNode.to, function (i, toNode){
                    g.addEdge(fromNode.from, toNode.name, {weight:toNode.weight});
                });
            });

            redraw();
        }

        fr.readAsText(file);
    });

};