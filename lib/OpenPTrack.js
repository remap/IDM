// Javscript OpenPTrack Filtering and ID Management Library

function normalize(data){
    var maxX = 2.3;
    var minX = -1.4;
    var maxY = 2.2;
    var minY = -4.4;    

    // normalize
    data.x = (data.x + Math.abs(minX)) / (maxX + Math.abs(minX));
    data.y = (data.y + Math.abs(minY)) / (maxY + Math.abs(minY));     


    // bound
    if (data.x < 0.0 ) {
        data.x = 0.0;
    } else if (data.x > 1.0) {
        data.x = 1.0;
    }

    if (data.y < 0.0 ) {
        data.y = 0.0;
    } else if (data.y > 1.0) {
        data.y = 1.0;
    }
}
