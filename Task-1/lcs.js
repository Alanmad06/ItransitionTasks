let args=process.argv.slice(2),r="";

const lcs = (arr)=>{
    if(arr.length>0){
        let s=arr[0],l=s.length;
        for(let i=0;i<l;i++){
            for(let j=i+1;j<=l;j++){
                let sub=s.slice(i,j);
                console.log(r)
                if(arr.every(str=>str.includes(sub))&&sub.length>r.length){
                    r=sub
                    
                }
            }
        }
    }
    return r
}

console.log(lcs(args))