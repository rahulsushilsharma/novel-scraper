export function cleanChapter(data:string[]){
  const outputData :string[] = []
  for(let pra of data){
    const temp = pra.replace('\n','')
    if(temp.length>0)outputData.push(temp)
  }
  return outputData;
}