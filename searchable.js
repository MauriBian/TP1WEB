class Searchable{
  constructor(_id, _name){
    this.id = _id;
    this.name = _name;
    if (this.constructor===Searchable)
    {
      throw new Error ("Clase abstracta")
    }
  }

    getId(){
      return this.id;
    }

    getName(){
      return this.name;
    }

    setId(id){
      this.id = id;
    }

    setName(name){
      this.name = name;
    }

}
module.exports = Searchable;
