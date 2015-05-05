/**
 * Fabric
 * Version 0.1.0
 *
 * Copyright 2015 Cichol
 * Released under the MIT license
 *
 * contact@cichol.com
 * http://www.cichol.com/
 **/

(function() {
    'use strict';
    
    let Global = this;
    
    /**
     * Global.prototype.enlarge(Object enlarger) : void
     * inject enlargements to the global namespace in non-enumerable
     **/
    Object.defineProperty(Global, 'enlarge', {
        value: function enlarge(enlarger) {
            if(!(enlarger instanceof Object)) {
                throw new TypeError('Type of enlarger object should be an object');
            }
            
            for(let property in enlarger) {
                let descriptor = Object.getOwnPropertyDescriptor(enlarger, property);
                
                if(descriptor && (descriptor.get || descriptor.set)) {
                    Object.defineProperty(this, property, {
                        get: descriptor.get || new Function(),
                        set: descriptor.set || new Function(),
                        enumerable: false,
                        configurable: true
                    });
                    
                    continue;
                }
                
                Object.defineProperty(this, property, {
                    value: enlarger[property],
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            }
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
    
    /**
     * Function.prototype.enlarge(Object enlarger) : void
     * inject enlargements to a function in non-enumerable
     **/
    Object.defineProperty(Function.prototype, 'enlarge', {
        value: function enlarge(enlarger) {
            if(!(enlarger instanceof Object)) {
                throw new TypeError('Type of enlarger object should be an object');
            }
            
            for(let property in enlarger) {
                let descriptor = Object.getOwnPropertyDescriptor(enlarger, property);
                
                if(descriptor && (descriptor.get || descriptor.set)) {
                    Object.defineProperty(this, property, {
                        get: descriptor.get || new Function(),
                        set: descriptor.set || new Function(),
                        enumerable: false,
                        configurable: true
                    });
                    
                    continue;
                }
                
                Object.defineProperty(this, property, {
                    value: enlarger[property],
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            }
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
    
    /**
     * Function.prototype.enhance(Object enhancer) : void
     * inject enhancements to prototype of an instance in non-enumerable
     **/
    Object.defineProperty(Function.prototype, 'enhance', {
        value: function enhance(enhancer) {
            if(!(enhancer instanceof Object)) {
                throw new TypeError('Type of enhancer object should be an object');
            }
            
            for(let property in enhancer) {
                let descriptor = Object.getOwnPropertyDescriptor(enhancer, property);
                
                if(descriptor && (descriptor.get || descriptor.set)) {
                    Object.defineProperty(this.prototype, property, {
                        get: descriptor.get || new Function(),
                        set: descriptor.set || new Function(),
                        enumerable: false,
                        configurable: true
                    });
                    
                    continue;
                }
                
                Object.defineProperty(this.prototype, property, {
                    value: enhancer[property],
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            }
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
    
    Function.enlarge({
        /**
         * Function.overload(Function abstractor) : Function
         * abstract function overloading
         **/
        overload: function overload(abstractor) {
            let conditions = [],
                contexts = [],
                otherwise = function overloaded() {
                    throw new TypeError('Unexpected arguments');
                };
            
            function overloader() {
                let condition = Array.cast(arguments),
                    context = condition.pop();
                
                if(!condition.length) {
                    otherwise = context;
                    
                    return;
                }
                
                conditions.push(condition);
                contexts.push(context);
            }
            
            function overloaded() {
                let args = Array.cast(arguments),
                    matchedIndex;
                
                conditions.forEach(function(condition, index) {
                    let isMatch = true;
                    
                    if(args.length !== condition.length) {
                        return;
                    }
                    
                    args.forEach(function(argument, order) {
                        isMatch = isMatch && condition[order] === argument.constructor;
                    });
                    
                    if(isMatch && args.length) {
                        matchedIndex = index;
                    }
                });
                
                if(matchedIndex !== undefined) {
                    return contexts[matchedIndex].apply(this, args);
                }
                
                return otherwise.apply(this, args);
            }
            
            overloaded.enlarge({
                toString: function toString() {
                    return conditions.map(function(condition) {
                        let types = [];
                        
                        for(let type of condition) {
                            types.push(type.name);
                        }
                        
                        return 'function overloaded(' + types.join(', ') + ') { [overloaded function] }';
                    }).join('\n') + '\nfunction overloaded() { [overloaded function] }';
                }
            });
            
            abstractor(overloader);
            
            return overloaded;
        }
    });
    
    Object.enlarge({
        /**
         * Object.merge(Object alpha, Object beta) : Object
         * merge both objects with comparison of keys
         **/
        merge: function merge(alpha, beta) {
            if(!(alpha instanceof Object) || !(beta instanceof Object)) {
                throw new TypeError('If each argument are not an object, cannot merge');
            }
            
            let merged = {};
            
            for(let key in alpha) {
                merged[key] = alpha[key];
            }
            
            for(let key in beta) {
                merged[key] = beta[key];
            }
            
            return merged;
        }
    });
    
    Object.enhance({
        /**
         * Object.prototype.forEach(Function callback) : void
         * executes the provided callback once for each element present in the object in defined order
         **/
        forEach: function forEach(callback) {
            if(typeof callback !== 'function') {
                throw new TypeError('Callback argument should be callable');
            }
            
            for(let key in this) {
                callback(this[key], key, this);
            }
        },
        
        /**
         * Getter Object.prototype.isCircular : Boolean
         * validate the object has own circular reference
         **/
        get isCircular() {
            let that = this,
                isCircular = false;
            
            that.forEach(function(value) {
                if(value === that) {
                    isCircular = true;
                    
                    return;
                }
                
                if(typeof value === 'object') {
                    isCircular = value.isCircular;
                }
            });
            
            return isCircular;
        },
        
        /**
         * Getter Object.prototype.clone : Object
         * make clone of the object
         **/
        get clone() {
            let clone = {};
            
            this.forEach(function(value, key) {
                clone[key] = value;
                
                if(typeof clone[key] === 'object' && (clone[key] instanceof Array || clone[key].constructor === Object) && !clone[key].isCircular) {
                    clone[key] = clone[key].clone;
                }
            });
            
            return clone;
        }
    });
    
    Array.enlarge({
        /**
         * Array.cast(Array-like target) : Array
         * make array from array-like something
         **/
        cast: function cast(target) {
            return Array.prototype.slice.call(target);
        },
        
        /**
         * Array.merge(Array alpha, Array beta) : Array
         * merge both arrays with comparison of values
         **/
        merge: function merge(alpha, beta) {
            if(!(alpha instanceof Array) || !(beta instanceof Array)) {
                throw new TypeError('If each argument are not an array, cannot merge');
            }
            
            let merged = [];
            
            alpha.forEach(function(element) {
                merged.push(element);
            });
            
            beta.forEach(function(element) {
                if(!merged.contains(element)) {
                    merged.push(element);
                }
            });
            
            return merged;
        },
        
        /**
         * Array.range(Number minimum, Number maximum) : Array
         * make array from provided range
         **/
        range: function range(minimum, maximum) {
            minimum = +minimum;
            maximum = +maximum;
            
            if(minimum > maximum) {
                return Array.range(maximum, minimum);
            } else if(minimum === maximum) {
                return [minimum];
            } else if(Math.abs(maximum - minimum) < 1) {
                if(Math.round(minimum) === Math.round(maximum)) {
                    return [Math.round(minimum)];
                } else {
                    return [];
                }
            }
            
            let ranged = [];
            
            for(let index = Math.ceil(minimum); index <= Math.floor(maximum); index++) {
                ranged.push(index);
            }
            
            return ranged;
        }
    });
    
    Array.enhance({
        /**
         * Getter Array.prototype.isEmpty : Boolean
         * validate the array is empty
         **/
        get isEmpty() {
            return !this.length;
        },
        
        /**
         * Getter Array.prototype.clone : Array
         * make clone of the array
         **/
        get clone() {
            let clone = [];
            
            this.forEach(function(element, index) {
                clone[index] = element;
                
                if(typeof clone[index] === 'object' && (clone[index] instanceof Array || clone[index].constructor.name === 'Object') && !clone[index].isCircular) {
                    clone[index] = clone[index].clone;
                }
            });
            
            return clone;
        },
        
        /**
         * Getter Array.prototype.first : Mixed
         * return first element
         **/
        get first() {
            return this[0];
        },
        
        /**
         * Getter Array.prototype.last : Mixed
         * return last element
         **/
        get last() {
            return this[this.length - 1];
        },
        
        /**
         * Array.prototype.exchange(Number alpha, Number beta) : Array
         * exchange position of both elements
         **/
        exchange: function exchange(alpha, beta) {
            alpha = +alpha;
            beta = +beta;
            
            if(alpha === NaN || beta === NaN) {
                throw new TypeError('If each argument are not a number, cannot merge');
            } else if(Math.abs(alpha) === Infinity || Math.abs(beta) === Infinity) {
                throw new RangeError('If each argument are not in capable range, cannot merge');
            }
            
            let clone = this.clone,
                temporary = clone[alpha];
            
            clone[alpha] = clone[beta];
            clone[beta] = temporary;
            
            return clone;
        },
        
        /**
         * Getter Array.prototype.shuffle : Array
         * shuffle all elements
         **/
        get shuffle() {
            let clone = this.clone,
                count = clone.length,
                temporary,
                index;
            
            while(count > 0) {
                index = Math.floor(Math.random() * count);
                count -= 1;
                clone = clone.exchange(count, index);
            }
            
            return clone;
        },
        
        /**
         * Array.prototype.contains(Mixed element) : Boolean
         * validate the object has provided element
         **/
        contains: function contains(element) {
            return this.indexOf(element) > -1;
        },
        
        /**
         * Getter Array.prototype.and : Boolean
         * executes logical-and calculation
         **/
        get and() {
            return this.every(function(element) {
                return element ? true : false;
            });
        },
        
        /**
         * Getter Array.prototype.or : Boolean
         * executes logical-or calculation
         **/
        get or() {
            return this.some(function(element) {
                return element ? true : false;
            });
        },
        
        /**
         * Getter Array.prototype.inverse : Array
         * make array of inverse boolean values
         **/
        get inverse() {
            return this.map(function(element) {
                return !element;
            });
        },
        
        /**
         * Array.prototype.paddingLeft(Mixed value, Number count) : Array
         * fill the array with provided value in count times
         **/
        paddingLeft: function paddingLeft(value, count) {
            count = +count;
            
            if(count === NaN) {
                throw new TypeError('If count is not a number, cannot execute padding');
            } else if(Math.abs(count) === Infinity) {
                throw new RangeError('If count is not in capable range, cannot execute padding');
            }
            
            let clone = this.clone;
            
            while(count-- > 0) {
                clone.unshift(value);
            }
            
            return clone;
        },
        
        /**
         * Array.prototype.paddingRight(Mixed value, Number count) : Array
         * fill the array with provided value in count times
         **/
        paddingRight: function paddingRight(value, count) {
            count = +count;
            
            if(count === NaN) {
                throw new TypeError('If count is not a number, cannot execute padding');
            } else if(Math.abs(count) === Infinity) {
                throw new RangeError('If count is not in capable range, cannot execute padding');
            }
            
            let clone = this.clone;
            
            while(count-- > 0) {
                clone.push(value);
            }
            
            return clone;
        }
    });
    
    String.enhance({
        /**
         * Getter String.prototype.first : String
         * return first character
         **/
        get first() {
            return this.substr(0, 1);
        },
        
        /**
         * Getter String.prototype.last : String
         * return last character
         **/
        get last() {
            return this.substr(-1);
        },
        
        /**
         * String.prototype.count(String string) : Number
         * count provided search string at the string
         **/
        count: function count(string) {
            return !string.length ? 0 : this.split(string).length - 1;
        },
        
        /**
         * String.prototype.repeat(Number count) : String
         * repeat the string in count times
         **/
        repeat: function repeat(count) {
            count = +count;
            
            if(count === NaN) {
                throw new TypeError('If count is not a number, cannot repeat');
            } else if(Math.abs(count) === Infinity) {
                throw new RangeError('If count is not in capable range, cannot repeat');
            }
            
            let repeated = '';
            
            while(count-- > 0) {
                repeated += this;
            }
            
            return repeated;
        },
        
        /**
         * String.prototype.contains(String string) : Boolean
         * validate the string contains provided search string
         **/
        contains: function contains(string) {
            return this.indexOf(string) > -1;
        },
        
        replaceAll: Function.overload(function(overloader) {
            /**
             * String.prototype.replaceAll(RegExp search, Mixed replacement) : String
             * replace provided regular expression to search with provided replacement value
             **/
            overloader(RegExp, function(search, replacement) {
                let string = this;
                
                while(search.test(string)) {
                    string = string.replace(search, replacement);
                }
                
                return string;
            });
            
            /**
             * String.prototype.replaceAll(Mixed search, Mixed replacement) : String
             * replace provided value to search with provided replacement value
             **/
            overloader(function(search, replacement) {
                return this.split(search).join(replacement);
            });
        })
    });
    
    Global.enlarge({
        /**
         * class Complex(Number real, Number imaginary)
         * constructor of complex number
         **/
        Complex: function Complex(real, imaginary) {
            if(!this) {
                return imaginary ? new Complex(real, imaginary) : real;
            }
            
            real = +real;
            imaginary = +imaginary;
            
            if(real === NaN || imaginary === NaN) {
                throw new TypeError('If each argument are not a number, cannot make a complex number');
            }
            
            /**
             * Getter Complex.prototype.real : Number
             * accessor of real part
             **/
            Object.defineProperty(this, 'real', {
                get: function() {
                    return real;
                },
                enumerable: false,
                configurable: true
            });
            
            /**
             * Complex.prototype.imaginary : Number
             * accessor of imaginary part
             **/
            Object.defineProperty(this, 'imaginary', {
                get: function() {
                    return imaginary;
                },
                enumerable: false,
                configurable: true
            });
        },
        
        /**
         * class Matrix(Array row, ...)
         * constructor of mathematical matrix
         **/
        Matrix: function Matrix() {
            if(!this) {
                let args = Array.cast(arguments);
                
                function Matrix() {
                    return Global.Matrix.apply(this, args);
                }
                
                Matrix.prototype = Global.Matrix.prototype;
                
                return new Matrix();
            }
            
            let data = Array.cast(arguments);
            
            if(!data.length) {
                throw new TypeError('Malformed matrix');
            }
            
            for(let row of data) {
                if(row instanceof Array) {
                   continue; 
                }
                
                throw new TypeError('Malformed matrix');
            }
            
            data.forEach(function(row, index) {
                if(!index || row.length === data[index - 1].length) {
                    return;
                }
                
                throw new TypeError('Malformed matrix');
            });
            
            /**
             * Getter Matrix.prototype.rows : Number
             * accessor of rows count
             **/
            Object.defineProperty(this, 'rows', {
                get: function() {
                    return data.length;
                },
                enumerable: false,
                configurable: true
            });
            
            /**
             * Getter Matrix.prototype.columns : Number
             * accessor of columns count
             **/
            Object.defineProperty(this, 'columns', {
                get: function() {
                    return data[0].length;
                },
                enumerable: false,
                configurable: true
            });
            
            /**
             * Matrix.prototype.item(Number row, Number column) : Mixed
             * accessor of matrix's element
             **/
            Object.defineProperty(this, 'item', {
                value: function item(row, column) {
                    row = +row;
                    column = +column;

                    if(row === NaN || column === NaN) {
                        throw new TypeError('If each argument are not a number, cannot merge');
                    } else if(Math.abs(row) === Infinity || Math.abs(column) === Infinity || row < 1 || column < 1) {
                        throw new RangeError('If each argument are not in capable range, cannot merge');
                    }
                    
                    let item = data[row - 1][column - 1];
                    
                    return item.constructor === Number ? item : item.clone;
                },
                writable: true,
                enumerable: false,
                configurable: true
            });
        }
    });
    
    Complex.enhance({
        /**
         * Getter Complex.prototype.clone : Complex
         * make clone of the complex number
         **/
        get clone() {
            return Complex(this.real, this.imaginary);
        },
         
        /**
         * Complex.prototype.toString : String
         * return stringified the complex number
         **/
        toString: function toString() {
            return this.real + ' + ' + this.imaginary + 'i';
        },
        
        add: Function.overload(function(overloader) {
            /**
             * Complex.prototype.add(Complex complex) : Complex
             * executes addition with complex number
             **/
            overloader(Complex, function add(complex) {
                return Complex(this.real.add(complex.real), this.imaginary.add(complex.imaginary));
            });
            
            /**
             * Complex.prototype.add(Number number) : Number
             * executes addition with real number
             **/
            overloader(Number, function add(number) {
                return Complex(this.real.add(number), this.imaginary);
            });
        }),
        
        subtract: Function.overload(function(overloader) {
            /**
             * Complex.prototype.subtract(Complex complex) : Complex
             * executes subtraction with complex number
             **/
            overloader(Complex, function subtract(complex) {
                return Complex(this.real.subtract(complex.real), this.imaginary.subtract(complex.imaginary));
            });
            
            /**
             * Complex.prototype.subtract(Number number) : Number
             * executes subtraction with real number
             **/
            overloader(Number, function subtract(number) {
                return Complex(this.real.subtract(number), this.imaginary);
            });
        }),
        
        multiply: Function.overload(function(overloader) {
            /**
             * Complex.prototype.multiply(Complex complex) : Complex
             * executes multiplication with complex number
             **/
            overloader(Complex, function multiply(complex) {
                return Complex(
                    this.real.multiply(complex.real).subtract(this.imaginary.multiply(complex.imaginary)),
                    this.imaginary.multiply(complex.real).add(this.real.multiply(complex.imaginary))
                );
            });
            
            /**
             * Complex.prototype.multiply(Number number) : Number
             * executes multiplication with real number
             **/
            overloader(Number, function multiply(number) {
                return Complex(this.real.multiply(number), this.imaginary.multiply(number));
            });
        }),
        
        divide: Function.overload(function(overloader) {
            /**
             * Complex.prototype.divide(Complex complex) : Complex
             * executes division with complex number
             **/
            overloader(Complex, function divide(complex) {
                return Complex(
                    this.real.multiply(complex.real).add(this.imaginary.multiply(complex.imaginary)).divide(
                        complex.real.multiply(complex.real).add(complex.imaginary.multiply(complex.imaginary))
                    ),
                    this.imaginary.multiply(complex.real).add(this.real.multiply(complex.imaginary)).divide(
                        complex.real.multiply(complex.real).add(complex.imaginary.multiply(complex.imaginary))
                    )
                );
            });
            
            /**
             * Complex.prototype.divide(Number number) : Number
             * executes division with real number
             **/
            overloader(Number, function divide(number) {
                return Complex(this.real.divide(number), this.imaginary.divide(number));
            });
        }),
        
        /**
         * Getter Complex.prototype.conjugate : Complex
         * return conjugate of the complex number
         **/
        get conjugate() {
            return Complex(this.real, -this.imaginary);
        }
    });
    
    Matrix.enhance({
        /**
         * Matrix.prototype.toString() : String
         * return stringified the matrix
         **/
        toString: function toString() {
            let string = [];
            
            for(let index = 0; index < this.rows; index++) {
                string.push([]);
                
                for(let subIndex = 0; subIndex < this.columns; subIndex++) {
                    string.last.push(this.item(index + 1, subIndex + 1));
                }
                
                string.push(string.pop().join(', '));
            }
            
            return string.join('\n');
        },
        
        /**
         * Getter Matrix.prototype.transposal : Matrix
         * make transposed matrix of the matrix
         **/
        get transposal() {
            let data = [];
            
            for(let index = 0; index < this.columns; index++) {
                let row = [];
                
                row.length = this.columns;
                
                data.push(row);
            }
            
            for(let index = 0; index < this.rows; index++) {
                for(let subIndex = 0; subIndex < this.columns; subIndex++) {
                    data[subIndex][index] = this.item(index + 1, subIndex + 1);
                }
            }
            
            return Matrix.apply(undefined, data);
        },
        
        /**
         * Getter Matrix.prototype.adjugate : Matrix
         * make adjugate matrix of the matrix
         **/
        get adjugate() {
            if(this.rows !== this.columns) {
                throw new TypeError('The matrix is not squared');
            }
            
            let that = this,
                data = [];
            
            Array.range(1, that.rows).forEach(function(index) {
                let row = [];
                
                Array.range(1, that.columns).forEach(function(subIndex) {
                    row.push(that.cofactor(index, subIndex));
                });
                
                data.push(row);
            });
            
            return Matrix.apply(undefined, data).transposal;
        },
        
        /**
         * Getter Matrix.prototype.trace : Matrix
         * return trace of the matrix
         **/
        get trace() {
            if(this.rows !== this.columns) {
                throw new TypeError('The matrix is not squared');
            }
            
            let that = this;
            
            return Array.range(1, this.rows).reduce(function(previous, index) {
                return previous.add(that.item(index, index));
            }, 0);
        },
        
        /**
         * Getter Matrix.prototype.determinant : Matrix
         * return determinant of the matrix
         **/
        get determinant() {
            if(this.rows !== this.columns) {
                throw new TypeError('The matrix is not squared');
            }
            
            if(this.rows === 1) {
                return this.item(1, 1);
            } else if(this.rows === 2) {
                return this.item(1, 1).multiply(this.item(2, 2)).subtract(this.item(1, 2).multiply(this.item(2, 1)));
            }
            
            let that = this;
            
            return Array.range(1, this.columns).reduce(function(previous, index) {
                return previous.add(that.item(1, index).multiply(that.cofactor(1, index)));
            }, 0);
        },
        
        /**
         * Matrix.prototype.cofactor(Number row, Number column) : Mixed
         * calculates cofactor of the matrix by provided arguments
         **/
        cofactor: function cofactor(row, column) {
            if(this.rows !== this.columns) {
                throw new TypeError('The matrix is not squared');
            }
            
            row = +row;
            column = +column;

            if(row === NaN || column === NaN) {
                throw new TypeError('If each argument are not a number, cannot merge');
            } else if(Math.abs(row) === Infinity || Math.abs(column) === Infinity || row < 1 || column < 1) {
                throw new RangeError('If each argument are not in capable range, cannot merge');
            }
            
            return Math.pow(-1, row.add(column)).multiply(this.minor(row, column));
        },
        
        /**
         * Matrix.prototype.minor(Number row, Number column) : Mixed
         * calculates minor of the matrix by provided arguments
         **/
        minor: function minor(row, column) {
            if(this.rows !== this.columns) {
                throw new TypeError('The matrix is not squared');
            }
            
            row = +row;
            column = +column;

            if(row === NaN || column === NaN) {
                throw new TypeError('If each argument are not a number, cannot merge');
            } else if(Math.abs(row) === Infinity || Math.abs(column) === Infinity || row < 1 || column < 1) {
                throw new RangeError('If each argument are not in capable range, cannot merge');
            }
            
            let that = this,
                data = [];
            
            Array.range(1, that.rows).forEach(function(index) {
                if(index === row) {
                    return;
                }
                
                let build = [];
                
                Array.range(1, that.columns).forEach(function(subIndex) {
                    if(subIndex === column) {
                        return;
                    }
                    
                    build.push(that.item(index,subIndex));
                });
                
                data.push(build);
            });
            
            return (Matrix.apply(undefined, data)).determinant;
        },
        
        /**
         * Getter Matrix.prototype.inverse : Matrix
         * make inverse matrix of the matrix
         **/
        get inverse() {
            if(this.rows !== this.columns) {
                throw new TypeError('The matrix is not squared');
            }
            
            if(this.determinant === 0) {
                throw new RangeError('Determinant of the matrix is equals to 0');
            }
            
            let that = this,
                data = [];
            
            Array.range(1, that.rows).forEach(function(index) {
                let row = [];
                
                Array.range(1, that.columns).forEach(function(subIndex) {
                    row.push(that.cofactor(index, subIndex));
                });
                
                data.push(row);
            });
            
            return this.adjugate.multiply(this.determinant.inverse);
        },
        
        add: Function.overload(function(overloader) {
            /**
             * Matrix.prototype.add(Matrix matrix) : Matrix
             * executes addition with matrix
             **/
            overloader(Matrix, function add(matrix) {
                let data = [];
                
                Array.range(0, this.rows - 1).forEach(function(row) {
                    data.push([]);
                    
                    Array.range(0, this.columns - 1).forEach(function(column) {
                        data[data.length - 1].push(matrix.item(row, column).add(this.item(row, column)));
                    });
                });
                
                return Matrix.apply(undefined, data);
            });
            
            /**
             * Matrix.prototype.add(Complex complex) : Complex
             * executes addition with complex number
             **/
            overloader(Complex, function add(complex) {
                let matrix = this,
                    data = [];
                
                Array.range(1, matrix.rows).forEach(function(row) {
                    data.push([]);
                    
                    Array.range(1, matrix.columns).forEach(function(column) {
                        data[data.length - 1].push(matrix.item(row, column).add(complex));
                    });
                });
                
                return Matrix.apply(undefined, data);
            });
            
            /**
             * Matrix.prototype.add(Number number) : Number
             * executes addition with real number
             **/
            overloader(Number, function add(number) {
                let matrix = this,
                    data = [];
                
                Array.range(1, matrix.rows).forEach(function(row) {
                    data.push([]);
                    
                    Array.range(1, matrix.columns).forEach(function(column) {
                        data[data.length - 1].push(matrix.item(row, column).add(number));
                    });
                });
                
                return Matrix.apply(undefined, data);
            });
        }),
        
        subtract: Function.overload(function(overloader) {
            /**
             * Matrix.prototype.subtract(Matrix matrix) : Matrix
             * executes subtraction with matrix
             **/
            overloader(Matrix, function subtract(matrix) {
                return this.add(matrix.multiply(-1));
            });
            
            /**
             * Matrix.prototype.subtract(Complex complex) : Complex
             * executes subtraction with complex number
             **/
            overloader(Complex, function subtract(complex) {
                return this.add(complex.multiply(-1));
            });
            
            /**
             * Matrix.prototype.subtract(Number number) : Number
             * executes subtraction with real number
             **/
            overloader(Number, function subtract(number) {
                return this.add(number.multiply(-1));
            });
        }),
        
        multiply: Function.overload(function(overloader) {
            /**
             * Matrix.prototype.multiply(Matrix matrix) : Matrix
             * executes multiplication with matrix
             **/
            overloader(Matrix, function(matrix) {
                if(this.columns !== matrix.rows) {
                    throw new RangeError('Count of the matrix\'s rows is not equals to count of provided matrix\'s columns');
                }
                
                let that = this,
                    data = [];
                
                Array.range(1, that.rows).forEach(function(index) {
                    let row = [];
                    
                    Array.range(1, matrix.columns).forEach(function(subIndex) {
                        let multiplied = Array.range(1, that.columns).reduce(function(previous, current) {
                            return that.item(index, current).multiply(matrix.item(current, subIndex)).add(previous);
                        }, 0);
                        
                        row.push(multiplied);
                    });
                    
                    data.push(row);
                });
                
                return Matrix.apply(undefined, data);
            });
            
            /**
             * Matrix.prototype.multiply(Complex complex) : Complex
             * executes multiplication with complex number
             **/
            overloader(Complex, function(complex) {
                let matrix = this,
                    data = [];
                
                Array.range(1, matrix.rows).forEach(function(row) {
                    data.push([]);
                    
                    Array.range(1, matrix.columns).forEach(function(column) {
                        data[data.length - 1].push(matrix.item(row, column).multiply(complex));
                    });
                });
                
                return Matrix.apply(undefined, data);
            });
            
            /**
             * Matrix.prototype.multiply(Number number) : Number
             * executes multiplication with real number
             **/
            overloader(Number, function(number) {
                let matrix = this,
                    data = [];
                
                Array.range(1, matrix.rows).forEach(function(row) {
                    data.push([]);
                    
                    Array.range(1, matrix.columns).forEach(function(column) {
                        data[data.length - 1].push(matrix.item(row, column).multiply(number));
                    });
                });
                
                return Matrix.apply(undefined, data);
            });
        })
    });
    
    Number.enlarge({
        /**
         * Number.build(String sign, String integer, String fraction) : Number
         * build provided parts into a number
         **/
        build: function build(sign, integer, fraction) {
            return Number((sign === '-' ? '-' : '') + integer + '.' + fraction);
        }
    });
    
    Number.enhance({
        /**
         * Getter Number.prototype.sign : String
         * accessor of the number's sign
         **/
        get sign() {
            return this < 0 ? '-' : '+';
        },
        
        /**
         * Getter Number.prototype.integer : String
         * stringified accessor of integer part
         **/
        get integer() {
            return (this | 0).toString();
        },
        
        /**
         * Getter Number.prototype.fraction : String
         * stringified accessor of fractional part
         **/
        get fraction() {
            if(this === Number(this.integer)) {
                return '0';
            }
            
            return this.toString().split('.').pop();
        },
        
        /**
         * Getter Number.prototype.inverse : Number
         * return inverse value of the number
         **/
        get inverse() {
            return (1).divide(this);
        },
        
        add: Function.overload(function(overloader) {
            /**
             * Number.prototype.add(Complex number) : Complex
             * executes fixed point addition with complex number
             **/
            overloader(Complex, function add(complex) {
                return complex.add(this);
            });
            
            /**
             * Number.prototype.add(Matrix number) : Matrix
             * executes fixed point addition with mathematical matrix
             **/
            overloader(Matrix, function add(matrix) {
                return matrix.add(this);
            });
            
            /**
             * Number.prototype.add(Number number) : Number
             * executes fixed point addition with real number
             **/
            overloader(Number, function add(number) {
                let alpha = this,
                    beta = number;
                
                if(alpha.fraction === '0' && beta.fraction === '0') {
                    return alpha + beta;
                }
                
                let integerLength = Math.max(alpha.integer.split('').length, beta.integer.split('').length),
                    fractionLength = Math.max(alpha.fraction.split('').length, beta.fraction.split('').length),
                    alphaInteger = alpha.integer.split(''),
                    betaInteger = beta.integer.split(''),
                    alphaFraction = alpha.fraction.split(''),
                    betaFraction = beta.fraction.split('');

                alphaInteger = alphaInteger.paddingLeft('0', betaInteger.length - alphaInteger.length);
                alphaFraction = alphaFraction.paddingLeft('0', betaFraction.length - alphaFraction.length);
                betaInteger = betaInteger.paddingLeft('0', alphaInteger.length - betaInteger.length);
                betaFraction = betaFraction.paddingLeft('0', alphaFraction.length - betaFraction.length);
                
                if(alpha.sign === '+' && beta.sign === '-') {
                    return alpha.subtract(-beta);
                } else if(alpha.sign === '-' && beta.sign === '+') {
                    return beta.add(alpha);
                }
                
                alphaFraction.reverse();
                betaFraction.reverse();

                let overflowed = 0;

                alphaFraction.forEach(function(element, index) {
                    alphaFraction[index] = Number(element) + Number(betaFraction[index]);
                });

                alphaFraction.forEach(function(element, index) {
                    if(element < 10) {
                        return;
                    }

                    alphaFraction[index] = element % 10;

                    if(index + 1 === alphaFraction.length) {
                        overflowed += 1;

                        return;
                    }

                    alphaFraction[index + 1] += 1;
                });

                alphaInteger.reverse();
                betaInteger.reverse();

                alphaInteger.forEach(function(element, index) {
                    alphaInteger[index] = (!index ? overflowed-- : 0) + Number(element) + Number(betaInteger[index]);
                });

                alphaInteger.forEach(function(element, index) {
                    if(element < 10) {
                        return;
                    }

                    alphaInteger[index] = element % 10;
                    alphaInteger[index + 1] = (!alphaInteger[index + 1] ? 0 : alphaInteger[index + 1]) + 1;
                });

                alphaInteger.reverse();
                alphaFraction.reverse();

                while(alphaFraction.last === '0') {
                    alphaFraction.pop();
                }

                return Number.build(alpha.sign, alphaInteger.join(''), alphaFraction.join(''));
            });
        }),
        
        subtract: Function.overload(function(overloader) {
            /**
             * Number.prototype.subtract(Complex number) : Complex
             * executes fixed point subtraction with complex number
             **/
            overloader(Complex, function subtract(complex) {
                return complex.subtract(this);
            });
            
            /**
             * Number.prototype.subtract(Matrix number) : Matrix
             * executes fixed point subtraction with mathematical matrix
             **/
            overloader(Matrix, function subtract(matrix) {
                return matrix.subtract(this);
            });
            
            /**
             * Number.prototype.subtract(Number number) : Number
             * executes fixed point subtraction with real number
             **/
            overloader(Number, function subtract(number) {
                let alpha = this,
                    beta = number;
                
                if(alpha.fraction === '0' && beta.fraction === '0') {
                    return alpha - beta;
                }
                
                let integerLength = Math.max(alpha.integer.split('').length, beta.integer.split('').length),
                    fractionLength = Math.max(alpha.fraction.split('').length, beta.fraction.split('').length),
                    alphaInteger = alpha.integer.split(''),
                    betaInteger = beta.integer.split(''),
                    alphaFraction = alpha.fraction.split(''),
                    betaFraction = beta.fraction.split('');

                alphaInteger = alphaInteger.paddingLeft('0', betaInteger.length - alphaInteger.length);
                alphaFraction = alphaFraction.paddingLeft('0', betaFraction.length - alphaFraction.length);
                betaInteger = betaInteger.paddingLeft('0', alphaInteger.length - betaInteger.length);
                betaFraction = betaFraction.paddingLeft('0', alphaFraction.length - betaFraction.length);
                
                if(alpha.sign === '+' && beta.sign === '-' || alpha.sign === '-' && beta.sign === '+') {
                    return alpha.add(-beta);
                }

                if(alpha.sign === '-') {
                    return alpha.add(-beta);
                }

                if(beta > alpha) {
                    return -beta.subtract(alpha);
                }

                alphaFraction.reverse();
                betaFraction.reverse();
                
                let overflowed = 0;

                alphaFraction.forEach(function(element, index) {
                    alphaFraction[index] = Number(element) - Number(betaFraction[index]);
                });

                alphaFraction.forEach(function(element, index) {
                    if(element >= 0) {
                        return;
                    }

                    alphaFraction[index] = 10 + element;

                    if(index + 1 === alphaFraction.length) {
                        overflowed -= 1;

                        return;
                    }

                    alphaFraction[index + 1] -= 1;
                });

                alphaInteger.reverse();
                betaInteger.reverse();

                alphaInteger.forEach(function(element, index) {
                    alphaInteger[index] = (!index ? overflowed++ : 0) + Number(element) - Number(betaInteger[index]);
                });

                alphaInteger.forEach(function(element, index) {
                    if(element >= 0) {
                        return;
                    }

                    alphaInteger[index] = 10 + element;

                    if(index + 1 === alphaInteger.length) {
                        return;
                    }

                    alphaInteger[index + 1] -= 1;
                });

                alphaInteger.reverse();
                alphaFraction.reverse();

                while(alphaFraction.last === '0') {
                    alphaFraction.pop();
                }

                return Number.build(alpha.sign, alphaInteger.join(''), alphaFraction.join(''));
            });
        }),
        
        multiply: Function.overload(function(overloader) {
            /**
             * Number.prototype.multiply(Complex number) : Complex
             * executes fixed point multiplication with complex number
             **/
            overloader(Complex, function multiply(complex) {
                return complex.multiply(this);
            });
            
            /**
             * Number.prototype.multiply(Matrix number) : Matrix
             * executes fixed point multiplication with mathematical matrix
             **/
            overloader(Matrix, function multiply(matrix) {
                return this.multiply(this);
            });
            
            /**
             * Number.prototype.multiply(Number number) : Number
             * executes fixed point multiplication with real number
             **/
            overloader(Number, function multiply(number) {
                let alpha = this,
                    beta = number,
                    sign = alpha.sign === beta.sign ? '+' : '-';

                alpha = alpha < 0 ? -alpha : alpha;
                beta = beta < 0 ? -beta : beta;
                
                if(alpha.fraction === '0' && beta.fraction === '0') {
                    return Number.build(sign, alpha * beta, 0);
                }

                let alphaInteger = alpha.integer.split(''),
                    betaInteger = beta.integer.split(''),
                    alphaFraction = alpha.fraction.split(''),
                    betaFraction = beta.fraction.split('');
                
                if(alphaFraction.length === 1 && alphaFraction.first === '0') {
                    alphaFraction = [];
                }
                
                if(betaFraction.length === 1 && betaFraction.first === '0') {
                    betaFraction = [];
                }

                alphaInteger = alphaInteger.paddingLeft('0', beta.toString().length - alpha.toString().length);
                betaInteger = betaInteger.paddingLeft('0', alpha.toString().length - beta.toString().length);

                let build = [],
                    alphaPadded = alphaInteger.concat(alphaFraction),
                    betaPadded = betaInteger.concat(betaFraction);

                alphaPadded.reverse();
                betaPadded.reverse();

                betaPadded.forEach(function(betaElement, betaIndex) {
                    alphaPadded.forEach(function(alphaElement, alphaIndex) {
                        let paddingCount = alphaPadded.length + betaPadded.length - alphaIndex - betaIndex,
                            multiplied = (Number(betaElement) * Number(alphaElement)).toString().split('');

                        while(paddingCount - 1 > multiplied.length) {
                            multiplied.unshift('0');
                        }

                        if(build.isEmpty) {
                            build = multiplied.map(function(element) {
                                return Number(element);
                            });

                            return;
                        }

                        multiplied.forEach(function(element, index) {
                            build[index] = Number(element) + Number(build[index]);
                        });
                    });
                });
                
                build.reverse();
                
                build.forEach(function(element, index) {
                    if(element < 10) {
                        return;
                    }

                    build[index] = element % 10;
                    build[index + 1] = (!build[index + 1] ? 0 : build[index + 1]) + 1;
                });
                
                build.reverse();
                
                let buildFraction = [];

                for(let index = 0; index < alphaFraction.length + betaFraction.length; index++) {
                    buildFraction.unshift(build.pop());
                }

                while(!build.first && build.length - 1) {
                    build.shift();
                }

                return Number.build(sign, build.join(''), buildFraction.join(''));
            });
        }),
        
        divide: Function.overload(function(overloader) {
            /**
             * Number.prototype.divide(Complex number) : Complex
             * executes fixed point division with complex number
             **/
            overloader(Complex, function divide(complex) {
                return complex.divide(this);
            });
            
            /**
             * Number.prototype.divide(Number number) : Number
             * executes fixed point division with real number
             **/
            overloader(Number, function divide(number) {
                let alpha = this,
                    beta = number,
                    sign = alpha.sign === beta.sign ? '+' : '-';

                alpha = alpha < 0 ? -alpha : alpha;
                beta = beta < 0 ? -beta : beta;
                
                if((alpha / beta).fraction === '0') {
                    return Number.build(sign, alpha / beta, '0');
                }
                
                while(alpha < 1 || beta < 1) {
                    alpha = alpha.multiply(10);
                    beta = beta.multiply(10);
                }
                
                let build = [],
                    dividend = alpha,
                    dividor = beta,
                    integerLength = Math.min(alpha.integer.length, beta.integer.length);
                
                while(dividor > dividend) {
                    build.push('0');
                    
                    dividend = dividend.multiply(10);
                }
                
                let remainder = dividend;
                
                do {
                    build.push((remainder / dividor | 0).toString());
                    
                    remainder = remainder.subtract(dividor.multiply(Number(build.last))).multiply(10);
                    
                    if(build.length - integerLength > 18) {
                        break;
                    }
                } while(remainder > 0);
                
                let buildInteger = [];
                
                while(integerLength-- > 0) {
                    buildInteger.push(build.shift());
                }
                
                return Number.build(sign, buildInteger.join(''), build.join(''));
            });
        })
    });
    
    /**
     * class Fabric()
     * constructor of fabric
     **/
    function Fabric() {
        
    };
    
    if(this.constructor.name === 'Window') {
        window.Fabric = new Fabric();
        
        return;
    }
    
    module.exports = new Fabric();
}).call(this.window ? window : global);
