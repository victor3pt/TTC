const sha256 = require("crypto-js/sha256");
// 腾腾币
class Block{
    constructor(data,previousHash){
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.computeHash();
        this.nonce = 1
    }

    computeHash(){
        return sha256(this.data + this.previousHash + this.nonce).toString();
    }

    getAnswer(difficulty){
        let answer = ''
        for(let i=0;i<difficulty;i++){
            answer += '0'
        }
        return answer
    }

    // 计算复合区块链难度要求的hash
    mine(difficulty){
        while(true){
            //console.log('区块链正在挖矿：' + this.hash)
            this.hash = this.computeHash()
            if(this.hash.substring(0,difficulty) !== this.getAnswer(difficulty)){
                this.nonce++
                this.hash = this.computeHash()
            }else{
                break
            }
        }
        console.log('挖矿结束',this.hash)
    }
}

class Chain{
    constructor(){
        this.chain = [this.bigBang()]
        this.difficulty = 3
    }

    getLastPrevHash(){
        return this.chain[this.chain.length-1]
    }

    addBlockToChain(newBlock){
        newBlock.previousHash = this.getLastPrevHash().hash
        // newBlock.hash = newBlock.computeHash()
        // 挖矿
        newBlock.mine(this.difficulty)
        this.chain.push(newBlock)
    }

    bigBang(){
        const genesisBlock = new Block('祖先区块','')
        return genesisBlock
    }

    vaildate(){
        // 是否只有祖先区块，只有祖先区块验证祖先区块是否被修改
        if(this.chain.length === 1){
            if(this.chain[0].hash!==this.chain[0].computeHash()){
                return false
            }
            return true
        }
        // 验证当前区块是否被篡改
        for(let i=1;i<=this.chain.length-1;i++){
            const vaildateToBlock = this.chain[i]
            if(vaildateToBlock.hash !== vaildateToBlock.computeHash()){
                console.log('数据篡改')
                return false
            }
            // 验证前后区块是否断裂
            const prevBlock = this.chain[i-1]
            if(vaildateToBlock.previousHash !== prevBlock.hash){
                console.log('前后区块断裂')
                return false
            }
        }
        return true
    }
}

const block = new Block('转账十元','')
const block1 = new Block('转账十个十元','')
const myChain = new Chain();
myChain.addBlockToChain(block)
myChain.addBlockToChain(block1)
// myChain.chain[1].data = '转账一百个十元'
// myChain.chain[1].hash = myChain.chain[1].computeHash();
//console.log(myChain)
console.log(myChain.vaildate())