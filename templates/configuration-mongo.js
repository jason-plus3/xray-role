//var conn=new Mongo();
//db=conn.getDb("xray");


// https://stackoverflow.com/a/3058974/162228
function atob(s) {
    var e={},i,k,v=[],r='',w=String.fromCharCode;
    var n=[[65,91],[97,123],[48,58],[43,44],[47,48]];

    for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
    for(i=0;i<64;i++){e[v[i]]=i;}

    for(i=0;i<s.length;i+=72){
        var b=0,c,x,l=0,o=s.substring(i,i+72);
        for(x=0;x<o.length;x++){
            c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
            while(l>=8){r+=w((b>>>(l-=8))%256);}
        }
    }
    return r;
}

var license="{{ xray_license }}";

// The license is base64 encoded yaml, where the value of licenses.xray.product is
// another base64 encoded blob.  Next line gets that value as text
var xrayLicense=atob(atob(license).match(/xray:\s+product:\s*(\w+)/im)[1]);

// xrayLicense is several lines of "key: value" pairs.  Split lines and map to JSON for convenience
var licenseData={};
xrayLicense
    .split("\n")
    .forEach(function(line) {
        var s=line.match(/^(.*?):\s*(.*)$/);
        if(s) {
            licenseData[s[1].trim()]=s[2].trim();
        }
    });


//print("License data:\n",JSON.stringify(licenseData,null,2 ));

db.createCollection("configuration");

var result=db.configuration.update({"config_id": "xrayConfig"},
    { "$set" : {
            "license_config": {
                "key": license,
                "id": licenseData.id,
            "license_to": licenseData.owner,
            "valid_until": licenseData.expires,
            "license_type": licenseData.type
        },
        "general_settings": {
            "xray_url": "http://jasons-macbook-pro.local:8000",
            "xray_id": "jfxr@01cd30fd8bddv5yr4ak8y2r7np",
            "xray_artifactory_id": "01CD30FD8BPM47VMPMPVTANAEE",
            "index_workers": 8,
            "bin_mgr_workers": 8,
            "persist_workers": 8,
            "alert_workers": 8,
            "analysis_workers": 8,
            "notification_workers": 8,
            "on_boarding_finished": true,
            "on_boarding_step": 7
        }
    }
});

print("Result=",result);