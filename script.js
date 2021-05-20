var n=2;
var arr=[];
var actual_operation="Determinant";
var mathjax_result="";
var size_of_matrices_to_be_multiplied=[2, 2, 2, 2];

function incrementSize()
{
    n++;
    updateSquareMatrix();
}

function decreaseSize()
{
    if(n==1)
    {
        window.alert("The minimum size of the matrix can be only 1x1...");
        return;
    }
    n--;
    updateSquareMatrix();
}

function changeButtonAction(operation_name) //Optimizar...
{
    document.getElementById("calculate_button").innerHTML="Calculate The "+operation_name;
    
    if(operation_name=="Power")    
    {
        document.getElementById("calculate_button").innerHTML+=":";
        document.getElementById("power_input").style["visibility"]="visible";
        document.getElementById("tableOfValues").style["display"]="block";
        document.getElementById("tdEquationsInputArea").style["display"]="none";
        document.getElementById("upDownTable").style["display"]="block";
        document.getElementsByClassName("multiplicationInputs")[0].style["display"]="none";
        document.getElementsByClassName("multiplicationInputs")[1].style["display"]="none"; 
    }

    else if(operation_name=="Values of System of Equations")
    {
        document.getElementById("power_input").style["visibility"]="hidden";
        document.getElementById("tableOfValues").style["display"]="none";
        document.getElementById("tdEquationsInputArea").style["display"]="block";
        document.getElementById("upDownTable").style["display"]="none";
        document.getElementsByClassName("multiplicationInputs")[0].style["display"]="none";
        document.getElementsByClassName("multiplicationInputs")[1].style["display"]="none"; 
    }

    else if(operation_name!="Matrix Multiplication")
    {
        document.getElementById("power_input").style["visibility"]="hidden"; 
        document.getElementById("tableOfValues").style["display"]="block"; 
        document.getElementById("tdEquationsInputArea").style["display"]="none";  
        document.getElementById("upDownTable").style["display"]="block";      
        document.getElementsByClassName("multiplicationInputs")[0].style["display"]="none";
        document.getElementsByClassName("multiplicationInputs")[1].style["display"]="none"; 
    }

    else
    {
        document.getElementsByClassName("multiplicationInputs")[0].style["display"]="block";
        document.getElementsByClassName("multiplicationInputs")[1].style["display"]="block";
        document.getElementById("power_input").style["visibility"]="hidden"; 
        document.getElementById("tableOfValues").style["display"]="none"; 
        document.getElementById("tdEquationsInputArea").style["display"]="none";  
        document.getElementById("upDownTable").style["display"]="none";
    }
        
    actual_operation=operation_name;
}

function updateSquareMatrix()
{
    let row_html="";
    for(let x=0; x<n; x++)
    {
        row_html+="<tr>";
        for(let y=0; y<n; y++)
        {
            row_html+="<td><input type='number' step='any' id='cell"+x.toString()+"x"+y.toString()+
            "' "+"style='width:"+(90).toString()+"%' /></td>";
        }
        row_html+="</tr>";
    }

    document.getElementById("tableOfValues").innerHTML=row_html;
}

function actual_array_to_mathjax(array, obtional_arr=false)
{
    mathjax_result+="\\begin{equation}\\left(\\begin{array}{";

    if(obtional_arr!=false)
        mathjax_result+="c".repeat(array.length)+"|"+"c".repeat(array.length);
    mathjax_result+="}";

    for(let i=0; i<array.length; i++)
    {
        for(let j=0; j<array[0].length; j++)
            mathjax_result+=(array[i][j]).toString()+" & ";
        
        if(obtional_arr!=false)
            for(let k=0; k<array[0].length; k++)
                mathjax_result+=obtional_arr[i][k].toString()+" & ";
        mathjax_result=mathjax_result.substring(0, mathjax_result.length-2)+"\\\\";
    }
    mathjax_result+="\\end{array}\\right)\\end{equation}";
}

function row_operation_mathjax(pivot_row=false, target_row, pivot_multiplier=false, target_multiplier)
{
    mathjax_result+="\\begin{equation} r_{\\text{"+(target_row+1).toString()+"}} = ("+
            (target_multiplier).toString()+")r_{\\text{"+(target_row+1).toString()+"}} "+
            ( (pivot_multiplier>0)?"-(":"+(")+(pivot_multiplier).toString()+")r_{\\text{"+
            (pivot_row+1).toString()+"}} \\end{equation}";
}

function interchange_row_mathjax(pivot_row, interchange_index)
{
    mathjax_result+="\\begin{equation} r_{\\text{"+(pivot_row+1).toString()+"}} \\quad"+
                        " \\textrm{interchanged} \\, r_{\\text{"+(interchange_index+1).toString()+
                        "}}\\end{equation}";
}

function doCalculations()
{
    mathjax_result="";

    if(actual_operation!="Values of System of Equations" && actual_operation!="Matrix Multiplication")
    {
        arr=[];

        for(let x=0; x<n; x++)
        {
            arr[x]=[];
            for(let y=0; y<n; y++)
            {
                arr[x][y]=parseFloat( document.getElementById("cell"+(x).toString()+"x"+(y).toString()).value );
                if(isNaN(arr[x][y]))
                {
                    window.alert("Matrix can't contain empty cells!");
                    return "";
                }
            }
        }

        if(actual_operation=="Determinant")
            calculateTheDeterminant(arr);

        else if(actual_operation=="Inverse")
            inverseMatrixWithRowOperations(arr);

        else if(actual_operation=="Power")
            calculatePower(arr);

        else if(actual_operation=="Orthogonal")
            writeResultForOrthogonal(arr);

        else if(actual_operation=="Adjoint")
            calculateAdjoint(arr);
    }

    else if(actual_operation=="Values of System of Equations")
        solveSoE(document.getElementById("EquationsInputArea").value);
 
    else
        calculateTheMatrixMultiplication();
        
    document.getElementById("SolutionArea").innerHTML = mathjax_result;
    MathJax.Hub.Typeset();
}


function calculateTheDeterminant(arr)
{
    var skalar=1;

    //Matrix to Mathjax
    mathjax_result="\\begin{equation} A = \\begin{bmatrix} ";
    for(let i=0; i<arr.length; i++)
    {
        for(let j=0; j<arr.length; j++)
        {     
            mathjax_result+=arr[i][j]+" & ";
        }
        mathjax_result=mathjax_result.substring(0, mathjax_result.length-2)+"\\\\ ";
    }
    mathjax_result+="\\end{bmatrix} = B \\end{equation} \\begin{equation} \\text{Det}(B)= \\text{Det}(A) \\\\ \\end{equation}";


    for(let pivot_row=0; pivot_row< arr.length-1; pivot_row++)
    {
        if (arr[pivot_row][pivot_row]==0)
            for (let interchange_index=pivot_row; interchange_index< arr.length; interchange_index++)
                if (arr[interchange_index][pivot_row]!=0) //Interchange operation
                {   
                    let temp=arr[pivot_row];
                    arr[pivot_row]=arr[interchange_index];
                    arr[interchange_index]=temp;

                    skalar*=-1;

                    //Matrix to Mathjax
                    mathjax_result+="\\begin{equation} r_{\\text{"+(pivot_row+1).toString()+"}} \\quad"+
                        " \\textrm{interchanged} \\, r_{\\text{"+(interchange_index+1).toString()+
                        "}} \\end{equation}"+
                        "\\begin{equation}  B = \\begin{bmatrix} "
                    for(let i=0; i<arr.length; i++)
                    {
                        for(let j=0; j<arr.length; j++)
                        {
                            mathjax_result+=arr[i][j]+" & ";
                        }
                        mathjax_result=mathjax_result.substring(0, mathjax_result.length-2)+"\\\\ ";
                    }
                    mathjax_result+="\\end{bmatrix} \\end{equation}"+
                        "\\begin{equation} \\text{Det}(B)= "+skalar.toString()+"( \\text{Det}(A) ) \\\\ \\\\ \\end{equation}";

                    break;
                }       

        for(let target_row=pivot_row+1; target_row<arr.length; target_row++)
        {
            if (arr[target_row][pivot_row] == 0)
                continue;

            var pivot_multiplier = arr[target_row][pivot_row];
            var target_multiplier = arr[pivot_row][pivot_row];

            skalar*= arr[pivot_row][pivot_row];

            for(let column_of_rows=0; column_of_rows<arr[0].length; column_of_rows++)
            {
                arr[target_row][column_of_rows] *= target_multiplier;
                arr[target_row][column_of_rows] -= arr[pivot_row][column_of_rows]*pivot_multiplier;
            }

            //Matrix to Mathjax
            mathjax_result+="\\begin{equation} r_{\\text{"+(target_row+1).toString()+"}} = ("+
            (target_multiplier).toString()+")r_{\\text{"+(target_row+1).toString()+"}} "+
            ( (pivot_multiplier>0)?"-(":"+(")+(pivot_multiplier).toString()+")r_{\\text{"+
            (pivot_row+1).toString()+"}} \\end{equation} \\begin{equation} B = \\begin{bmatrix} "
            for(let i=0; i<arr.length; i++)
            {
                for(let j=0; j<arr.length; j++)
                {
                    mathjax_result+=arr[i][j]+" & ";
                }
                mathjax_result=mathjax_result.substring(0, mathjax_result.length-2)+"\\\\ ";
            }
            mathjax_result+="\\end{bmatrix} \\end{equation} \\begin{equation} \\text{Det}(B)= "+
            skalar.toString()+"( \\text{Det}(A) ) \\\\ \\\\ \\end{equation}";
        }
    }

    determinant=1;
    mathjax_result+="\\begin{equation} \\text{Det}(B)="

    for(let x=0; x<arr.length; x++)
    {
        determinant*=arr[x][x];
        mathjax_result+="("+arr[x][x].toString()+")"
    }
    mathjax_result+="="+determinant.toString()+"\\end{equation}"
    determinant/=skalar;    

    mathjax_result+="\\begin{equation} \\frac{\\text{Det}(B)}{"+skalar.toString()+"}= \\text{Det}(A) ="+determinant.toString()+" \\end{equation}";
    return determinant;
}

function lower_triangular_form(arr, obtional_arr=false)
{
    var skalar=1;

    actual_array_to_mathjax(arr, obtional_arr);
    mathjax_result+="\\";
    
    for(let pivot_row=0; pivot_row< arr.length-1; pivot_row++)
    {
        if (arr[pivot_row][pivot_row]==0)
            for (let interchange_index=pivot_row+1; interchange_index< arr.length; interchange_index++)
                if (arr[interchange_index][pivot_row]!=0) //Interchange operation
                {   
                    let temp=arr[pivot_row];
                    arr[pivot_row]=arr[interchange_index];
                    arr[interchange_index]=temp;

                    if(obtional_arr!=false)
                    {
                        temp=obtional_arr[pivot_row];
                        obtional_arr[pivot_row]=obtional_arr[interchange_index];
                        obtional_arr[interchange_index]=temp;
                    }

                    skalar*=-1;

                    interchange_row_mathjax(pivot_row, interchange_index);
                    actual_array_to_mathjax(arr, obtional_arr);
                    mathjax_result+="\\";

                    break;
                }       

        for(let target_row=pivot_row+1; target_row<arr.length; target_row++)
        {
            if (arr[target_row][pivot_row] == 0)
                continue;

            var pivot_multiplier = arr[target_row][pivot_row];
            var target_multiplier = arr[pivot_row][pivot_row];

            skalar*= arr[pivot_row][pivot_row];

            for(let column_of_rows=0; column_of_rows<arr[0].length; column_of_rows++)
            {
                arr[target_row][column_of_rows] *= target_multiplier;
                arr[target_row][column_of_rows] -= arr[pivot_row][column_of_rows]*pivot_multiplier;

                if(obtional_arr!=false)
                {
                    obtional_arr[target_row][column_of_rows] *= target_multiplier;
                    obtional_arr[target_row][column_of_rows] -= obtional_arr[pivot_row][column_of_rows]*pivot_multiplier;
                } 
            }

            row_operation_mathjax(pivot_row, target_row, pivot_multiplier, target_multiplier);
            actual_array_to_mathjax(arr, obtional_arr);
            mathjax_result+="\\";
        }
    }

    return skalar; 
}

function upper_triangular_form(arr, obtional_arr=false)
{
    var skalar=1;

    actual_array_to_mathjax(arr, obtional_arr);
    mathjax_result+="\\";

    for(let pivot_row=arr.length-1; pivot_row>0; pivot_row--)
    {
        if (arr[pivot_row][pivot_row]==0)
            for (let interchange_index=pivot_row-1; interchange_index>-1; interchange_index--)
                if (arr[interchange_index][pivot_row]!=0) //Interchange operation
                {   
                    let temp=arr[pivot_row];
                    arr[pivot_row]=arr[interchange_index];
                    arr[interchange_index]=temp;

                    if(obtional_arr!=false)
                    {
                        temp=obtional_arr[pivot_row];
                        obtional_arr[pivot_row]=obtional_arr[interchange_index];
                        obtional_arr[interchange_index]=temp;
                    }

                    skalar*=-1;

                    interchange_row_mathjax(pivot_row, interchange_index);
                    actual_array_to_mathjax(arr, obtional_arr);
                    mathjax_result+="\\";

                    break;
                }       

        for(let target_row=pivot_row-1; target_row>-1; target_row--)
        {
            if (arr[target_row][pivot_row] == 0)
                continue;

            var pivot_multiplier = arr[target_row][pivot_row];
            var target_multiplier = arr[pivot_row][pivot_row];

            skalar*= arr[pivot_row][pivot_row];

            for(let column_of_rows=0; column_of_rows<arr[0].length; column_of_rows++)
            {
                arr[target_row][column_of_rows] *= target_multiplier;
                arr[target_row][column_of_rows] -= arr[pivot_row][column_of_rows]*pivot_multiplier;

                if(obtional_arr!=false)
                {
                    obtional_arr[target_row][column_of_rows] *= target_multiplier;
                    obtional_arr[target_row][column_of_rows] -= obtional_arr[pivot_row][column_of_rows]*pivot_multiplier;
                }
            }
            row_operation_mathjax(pivot_row, target_row, pivot_multiplier, target_multiplier);
            actual_array_to_mathjax(arr, obtional_arr);
            mathjax_result+="\\";
        }
    }

    return skalar;
}


function buildIdentityMatrix(n)
{
    var identity=[];

    for(let x=0; x<n; x++)
    {
        identity[x]=[];

        for(let y=0; y<x; y++)
            identity[x][y]=0;

        identity[x][x]=1;

        for(let y=x+1; y<n; y++)
            identity[x][y]=0;
    }
        
    return identity;
}

function calculateDeterminant(arr)
{
    let triangular_matrix=[];
    for (let i = 0; i < arr.length; i++)
        triangular_matrix[i] = arr[i].slice();

    let skalar=lower_triangular_form(triangular_matrix);
    let determinant=1;

    for(let x=0; x<triangular_matrix.length; x++)
        determinant*=triangular_matrix[x][x];
    determinant/=skalar;    

    return determinant;
}

function inverseMatrixWithRowOperations(arr) 
{

    if(calculateDeterminant(arr)==0)
    {
        window.alert("The determinant of the matrix is 0, then the matrix has not an inverse form...");
        return;
    }
    
    mathjax_result="\\[\\left(\\begin{array}{c|c}\\text{A} & \\text{I}\\end{array}\\right) \\xrightarrow{\\text{Converting with row operations}} "+
        "\\left(\\begin{array}{c|c}\\text{I} & \\text{A}^{-1}\\end{array}\\right) \\\\\\ \\]";

    let identity_matrix=buildIdentityMatrix(arr.length);

    lower_triangular_form(arr, identity_matrix);
    upper_triangular_form(arr, identity_matrix);

    for(let row=0; row<arr.length; row++)
    {
        for(let column=0; column<arr[0].length; column++)
            identity_matrix[row][column]/=arr[row][row];

        mathjax_result+="\\begin{equation} r_{\\text{"+(row+1).toString()+"}} = (\\frac{1}{"+
            (arr[row][row]).toString()+"})r_{\\text{"+(row+1).toString()+"}}\\end{equation}"; 
        arr[row][row]/=arr[row][row];
    }
        
    actual_array_to_mathjax(arr, identity_matrix);
    return identity_matrix;
}

function calculatePower(arr)
{
    let power=parseInt(document.getElementById("power_input").value);

    if(isNaN(power))
    {
        window.alert("Power's cell can not be empty...")
        return;
    }

    if(!Number.isInteger(power))
    {
        window.alert("We can not calculate fraction exponents...")
        return;
    }

    if(power>1000 || power<-1000)
    {
        window.alert("We cannot calculate such great powers...")
        return;
    }

    if(power>1)
    {
        mathjax_result+="$$ A=";
        actual_array_to_mathjax(arr);
        mathjax_result+="$$";

        var arr_copy = [];
        for(let x=0; x<arr.length; x++)
        {
            arr_copy.push([]);
            for(let y=0; y<arr[0].length; y++)
                arr_copy[x].push(arr[x][y]);
        }

        for(let p=2; p<=power; p++)
        {
            mathjax_result+="$$(A)^{"+p.toString()+"}=";
            arr=multiplication(arr, arr_copy);
            mathjax_result+="$$";
        }
    }

    else if(power==1)
    {
        mathjax_result+="$$A = ";
        actual_array_to_mathjax(arr);
        mathjax_result+="$$";
    }

    else if(power==0)
    {
        arr=buildIdentityMatrix(arr.length)
        mathjax_result+="$$A = ";
        actual_array_to_mathjax(arr);
        mathjax_result+="$$";
    }

    else
    {
        arr=inverseMatrixWithRowOperations(arr);

        mathjax_result="$$ A^{-1}=";
        actual_array_to_mathjax(arr);
        mathjax_result+="$$";

        var arr_copy = [];
        for(let x=0; x<arr.length; x++)
        {
            arr_copy.push([]);
            for(let y=0; y<arr[0].length; y++)
                arr_copy[x].push(arr[x][y]);
        }

        for(let p=2; p<=-power; p++)
        {
            mathjax_result+="$$(A)^{-"+p.toString()+"}=";
            arr=multiplication(arr, arr_copy);
            mathjax_result+="$$";
        }
    }
}

function multiplication(arr1, arr2)
{
    var result=[];

    for(let row=0; row<arr1.length; row++)
    {
        result[row]=[];

        for(let column_arr2=0; column_arr2<arr2[0].length; column_arr2++)
        {
            result[row].push(0);
            for(let column_arr1=0; column_arr1<arr1[0].length; column_arr1++)
            {
                result[row][column_arr2]+=(arr1[row][column_arr1]*arr2[column_arr1][column_arr2]);
            }     
        }   
    }
    actual_array_to_mathjax(result);
    return result;
}

function writeResultForOrthogonal()
{
    if(orthogonalChecker())
        mathjax_result="\\begin{equation} A^{T}A = A A^{T} = I \\end{equation}";
    else
        mathjax_result="\\begin{equation} A^{T}A \\ne I \\end{equation}";
}

function orthogonalChecker()
{
    let sum_result;
    let column;
    let target_row;

    for(let pivot_row=0; pivot_row<arr.length; pivot_row++)
    {
        sum_result=0;
        column=0;
        for(; column<arr[0].length; column++)
            sum_result+=arr[pivot_row][column]*arr[pivot_row][column];
        if(sum_result!=1)
            return false;
        
        target_row=pivot_row+1;
        for(; target_row<arr.length; target_row++)
        {
            sum_result=0;
            column=0;
            for(; column<arr[0].length; column++)
                sum_result+=arr[pivot_row][column]*arr[target_row][column];
            if(sum_result!=0)
                return false;
        }
    }
    return true;
}


//------------------Solve System of Equations----------------------------------
function findVariablesNamesAtAllEquations(system_of_equations)
{
    //Se acepta que cada variable sera una letra.

    let number_of_equations=1;
    let variables=new Set();
    
    for(let character_index=0; character_index<system_of_equations.length; character_index++)
    {
        if(system_of_equations.charAt(character_index)==',')
            number_of_equations++;
        else if('a'<=system_of_equations.charAt(character_index) && system_of_equations.charAt(character_index)<='z')
            variables.add( system_of_equations.charAt(character_index) );
    }

    return [number_of_equations, Array.from(variables)]
}

function buildTheAugmentedMatrix(system_of_equations, arr_info)
{
    let augmented_matrix=[];

    for(let x=0; x<arr_info[0]; x++)
        augmented_matrix.push(new Array(arr_info[1].length+1).fill(0));
    
    let equation_index=0;
    let constant="";
    let polarity=1;

    for(let character_index=0; character_index<system_of_equations.length; character_index++)
    {
        if((system_of_equations.charAt(character_index)>="0" && system_of_equations.charAt(character_index)<="9") ||
                system_of_equations.charAt(character_index)==".")
            constant+=system_of_equations.charAt(character_index);


        else
        {
            if(system_of_equations.charAt(character_index)>="a" && system_of_equations.charAt(character_index)<="z")
            {
                let variable_index=0;

                while(arr_info[1][variable_index]!=system_of_equations.charAt(character_index))
                    variable_index++;

                if(constant.length==0)
                    constant="1";
                else if(constant.length==1 && constant.charAt(0)=="-")
                    constant="-1";
                
                augmented_matrix[equation_index][variable_index]+=polarity*parseFloat(constant);

                constant=""; 
            }

            else if((system_of_equations.charAt(character_index)=="-" ||
                    system_of_equations.charAt(character_index)=="+") )
            {
                if(constant.length!=0)
                {
                    augmented_matrix[equation_index][arr_info[1].length]+=-polarity*parseFloat(constant);
                    constant="";
                }

                if(system_of_equations.charAt(character_index)=="-") 
                    constant="-";          
            }     

            if(system_of_equations.charAt(character_index)==",")
            {
                if(constant.length!=0)
                {
                    augmented_matrix[equation_index][arr_info[1].length]+=-polarity*parseFloat(constant);
                    constant="";
                }

                polarity=1;
                equation_index++;
            }

            else if(system_of_equations.charAt(character_index)=="=")
            {
                if(constant.length!=0)
                {
                    augmented_matrix[equation_index][arr_info[1].length]+=-polarity*parseFloat(constant);
                    constant="";
                }

                polarity=-1;
            }
        }        
    }

    if(constant.length!=0)
    {
        augmented_matrix[equation_index][arr_info[1].length]+=-polarity*parseFloat(constant);
        constant="";
    }
    
    return augmented_matrix;
}

function actual_soe_array_to_mathjax(augmented_matrix)
{
    mathjax_result+="\\begin{equation}\\left(\\begin{array}{"+"c".repeat(augmented_matrix[0].length-1)+"|"+"c}";

    for(let i=0; i<augmented_matrix.length; i++)
    {
        for(let j=0; j<augmented_matrix[0].length-1; j++)
            mathjax_result+=augmented_matrix[i][j].toString()+" & ";

        mathjax_result+=augmented_matrix[i][augmented_matrix[0].length-1].toString()+"\\\\";
    }
    mathjax_result+="\\end{array}\\right)\\end{equation}";
}

function soe_gauss(augmented_matrix)
{
    actual_soe_array_to_mathjax(augmented_matrix);
    mathjax_result+="\\";

    for(let pivot_row=0; pivot_row< augmented_matrix.length-1; pivot_row++)
    {
        if (augmented_matrix[pivot_row][pivot_row]==0)
            for (let interchange_index=pivot_row+1; interchange_index< augmented_matrix.length; interchange_index++)
                if (augmented_matrix[interchange_index][pivot_row]!=0) //Interchange operation
                {   
                    let temp=augmented_matrix[pivot_row];
                    augmented_matrix[pivot_row]=augmented_matrix[interchange_index];
                    augmented_matrix[interchange_index]=temp;

                    interchange_row_mathjax(pivot_row, interchange_index);
                    actual_soe_array_to_mathjax(augmented_matrix);
                    mathjax_result+="\\";

                    break;
                }       

        for(let target_row=pivot_row+1; target_row<augmented_matrix.length; target_row++)
        {
            if (augmented_matrix[target_row][pivot_row] == 0)
                continue;

            var pivot_multiplier = augmented_matrix[target_row][pivot_row];
            var target_multiplier = augmented_matrix[pivot_row][pivot_row];

            for(let column_of_rows=0; column_of_rows<augmented_matrix[0].length; column_of_rows++)
            {
                augmented_matrix[target_row][column_of_rows] *= target_multiplier;
                augmented_matrix[target_row][column_of_rows] -= augmented_matrix[pivot_row][column_of_rows]*pivot_multiplier;
            }

            row_operation_mathjax(pivot_row, target_row, pivot_multiplier, target_multiplier);
            actual_soe_array_to_mathjax(augmented_matrix);
            mathjax_result+="\\";
        }
    }

    for(let pivot_row=augmented_matrix.length-1; pivot_row>0; pivot_row--)
    {
        if (augmented_matrix[pivot_row][pivot_row]==0)
            for (let interchange_index=pivot_row-1; interchange_index>-1; interchange_index--)
                if (augmented_matrix[interchange_index][pivot_row]!=0) //Interchange operation
                {   
                    let temp=augmented_matrix[pivot_row];
                    augmented_matrix[pivot_row]=augmented_matrix[interchange_index];
                    augmented_matrix[interchange_index]=temp;

                    interchange_row_mathjax(pivot_row, interchange_index);
                    actual_soe_array_to_mathjax(augmented_matrix);
                    mathjax_result+="\\";

                    break;
                }       

        for(let target_row=pivot_row-1; target_row>-1; target_row--)
        {
            if (augmented_matrix[target_row][pivot_row] == 0)
                continue;

            var pivot_multiplier = augmented_matrix[target_row][pivot_row];
            var target_multiplier = augmented_matrix[pivot_row][pivot_row];

            for(let column_of_rows=0; column_of_rows<augmented_matrix[0].length; column_of_rows++)
            {
                augmented_matrix[target_row][column_of_rows] *= target_multiplier;
                augmented_matrix[target_row][column_of_rows] -= augmented_matrix[pivot_row][column_of_rows]*pivot_multiplier;
            }
            row_operation_mathjax(pivot_row, target_row, pivot_multiplier, target_multiplier);
            actual_soe_array_to_mathjax(augmented_matrix);
            mathjax_result+="\\";
        }
    }

    for(let row=0; row<augmented_matrix.length; row++)
    {
        let divisor=augmented_matrix[row][row];
        if(divisor!=0)
            for(let column=0; column<augmented_matrix[0].length; column++)
                augmented_matrix[row][column]/=divisor;

        mathjax_result+="\\begin{equation} r_{\\text{"+(row+1).toString()+"}} = (\\frac{1}{"+
            (divisor).toString()+"})r_{\\text{"+(row+1).toString()+"}}\\end{equation}"; 
    }
        
    actual_soe_array_to_mathjax(augmented_matrix);
}


function solveSoE(system_of_equations)
{
    let info_of_system_of_equations=findVariablesNamesAtAllEquations(system_of_equations);
    let augmented_matrix=buildTheAugmentedMatrix(system_of_equations, info_of_system_of_equations);

    mathjax_result+="$$\\text{Columns Order:  ";
    for(let x=0; x<info_of_system_of_equations[1].length; x++)
        mathjax_result+=info_of_system_of_equations[1][x]+"-";
    mathjax_result+="constant}$$";

    
    soe_gauss(augmented_matrix);
}

function calculateCofactor(array, pivot_row_number, pivot_column_number, temp_arr)
{
    let temp_arr_row_number, temp_arr_column_number, x, y;
    temp_arr_row_number=0; temp_arr_column_number=0; y=0;

    for(; y<pivot_row_number; y++, temp_arr_row_number++)
    {
        x=0; temp_arr_column_number=0;

        for(;x<pivot_column_number; x++, temp_arr_column_number++)
            temp_arr[temp_arr_row_number][temp_arr_column_number]=array[y][x];

        x++; 

        for(;x<array.length; x++, temp_arr_column_number++)
            temp_arr[temp_arr_row_number][temp_arr_column_number]=array[y][x];
    }

    y++;

    for(; y<array.length; y++, temp_arr_row_number++)
    {
        x=0; temp_arr_column_number=0;

        for(;x<pivot_column_number; x++, temp_arr_column_number++)
            temp_arr[temp_arr_row_number][temp_arr_column_number]=array[y][x];

        x++; 

        for(;x<array.length; x++, temp_arr_column_number++)
            temp_arr[temp_arr_row_number][temp_arr_column_number]=array[y][x];
    }

    if((pivot_column_number+pivot_row_number)%2==0)
        return calculateDeterminant(temp_arr);

    return -calculateDeterminant(temp_arr);
}

function calculateAdjoint(array)
{
    let temp_arr=[];
    let result_arr=[];

    for(let q=0; q<array.length-1; q++) //n-1 square matrix
    {
        temp_arr.push([]);
        result_arr.push([]);
    }  
    result_arr.push([]); //n square  

    for(let pivot_row_number=0; pivot_row_number<array.length; pivot_row_number++)
        for(let pivot_column_number=0; pivot_column_number<array.length; pivot_column_number++)

            result_arr[pivot_column_number][pivot_row_number]=
                calculateCofactor(array, pivot_row_number, pivot_column_number, temp_arr);

    mathjax_result="$$Adjoint=C^{T}$$";
    actual_array_to_mathjax(result_arr)
}

function changeSizeOfMatricesToBeMultiplied(arr_with_data) // [0-4, 0-1]
{                                                          /* First index represents if a change will be 
                                                              made in the number of columns or rows of 
                                                              matrix1 or matrix2.
                                                              
                                                              Second index represents if the selected item 
                                                              will be increased or decreased.*/
    if(arr_with_data[0]==1 || arr_with_data[0]==2)
    {
        if(arr_with_data[1]==0)
        {
            if(size_of_matrices_to_be_multiplied[1]==1)
                return;

            size_of_matrices_to_be_multiplied[1]--;
            size_of_matrices_to_be_multiplied[2]--;
        }
            
        else
        {
            size_of_matrices_to_be_multiplied[1]++;
            size_of_matrices_to_be_multiplied[2]++;
        }
        
    }

    else if(arr_with_data[0]==0)
    {
        if(arr_with_data[1]==0)
        {
            if(size_of_matrices_to_be_multiplied[0]==1)
                return;

            size_of_matrices_to_be_multiplied[0]--;
        }
            
        else
            size_of_matrices_to_be_multiplied[0]++;
    }

    else
    {
        if(arr_with_data[1]==0)
        {
            if(size_of_matrices_to_be_multiplied[3]==1)
                return;

            size_of_matrices_to_be_multiplied[3]--;
        }
            
        else
            size_of_matrices_to_be_multiplied[3]++;
    }

    updateMatricesToBeMultiplied();
}

function updateMatricesToBeMultiplied()
{
    let matrix1_html="";
    let matrix2_html="";

    for(let x=0; x<size_of_matrices_to_be_multiplied[0]; x++)
    {
        matrix1_html+="<tr>";
        for(let y=0; y<size_of_matrices_to_be_multiplied[1]; y++)
        {
            matrix1_html+="<td><input type='number' step='any' id='cellOfFirstMatrix"+
                x.toString()+"x"+y.toString()+"' "+"style='width:"+(90).toString()+"%' /></td>";
        }
        matrix1_html+="</tr>";
    }

    for(let x=0; x<size_of_matrices_to_be_multiplied[2]; x++)
    {
        matrix2_html+="<tr>";
        for(let y=0; y<size_of_matrices_to_be_multiplied[3]; y++)
        {
            matrix2_html+="<td><input type='number' step='any' id='cellOfSecondMatrix"+
                x.toString()+"x"+y.toString()+"' "+"style='width:"+(90).toString()+"%' /></td>";
        }
        matrix2_html+="</tr>";
    }

    document.getElementById("multiplicationInputs1").innerHTML=matrix1_html;
    document.getElementById("multiplicationInputs2").innerHTML=matrix2_html;
}

function calculateTheMatrixMultiplication()
{
    let temp_sum, temp_value, value_of_matrix1, value_of_matrix2, result_arr;
    result_arr=[];

    for(let matrix1_row=0; matrix1_row<size_of_matrices_to_be_multiplied[0]; matrix1_row++)
    {
        result_arr[matrix1_row]=[];

        for(let matrix2_column=0; matrix2_column<size_of_matrices_to_be_multiplied[3]; matrix2_column++)
        {
            temp_sum=0;

            for(let matrix1_column=0; matrix1_column<size_of_matrices_to_be_multiplied[1]; matrix1_column++)
            {
                temp_value=parseFloat( document.getElementById("cellOfFirstMatrix"+(matrix1_row).toString()+"x"+(matrix1_column).toString()).value)*
                    parseFloat(document.getElementById("cellOfSecondMatrix"+(matrix1_column).toString()+"x"+(matrix2_column).toString()).value);

                if(isNaN(temp_value))
                {
                    window.alert("Matrix can't contain empty cells!");
                    return "";
                }

                temp_sum+=temp_value;
            }

            result_arr[matrix1_row][matrix2_column]=temp_sum;
        }        
    }

    actual_array_to_mathjax(result_arr);
}
