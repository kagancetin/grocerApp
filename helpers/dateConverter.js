module.exports = {
    convertForDB : (time) => {
        let d = time.slice(0,2);
        let m = time.slice(3,5);
        let y = time.slice(6,10);
        let t = time.slice(10,time.length);
        let h = parseInt(t.split(':')[0]) < 10 ? "0" + t.split(':')[0] : t.split(':')[0];
        let min = t.split(':')[1];
        let convertedTime = y + "-" + m + "-" + d + "T" + h + ":" + min + ":00";

        return new Date(convertedTime)
    }
}