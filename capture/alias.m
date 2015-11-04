function [ i ] = alias( char )
%ALIAS Summary of this function goes here
%   Detailed explanation goes here

switch char
    case 'A'
        i = 1;
    case 'V'
        i = 2;
    case 'G'   
        i = 3;
    case 'U'   
        i = 4;
    case 'L'   
        i = 5;
    case 'P'
        i = 6;
    case 'O'
        i = 7;        
    case 'E'
        i = 8; 
    case 'S'
        i = 9;        
    case 'SH'
        i = 10; 
    case 'I'
        i = 11;
    case 'K'
        i = 12;
    case 'Ya'
        i = 13;
    case 'R'
        i = 14;
    case 'II'
        i = 15;
    case 'N'
        i = 16;        
    case 'TS'
        i = 17;
    case 'ZH'
        i = 18;    
    case 'Z'
        i = 19;    
    case 'H'
        i = 20;  
    case 'T'
        i = 21;
    case 'M'
        i = 22;
    case 'YU'
        i = 23;  
    case 'JE'
        i = 24;  
    case 'CH'
        i = 25;        
    case 'F'
        i = 26;        
        
        
    otherwise
       disp('other value')
       disp(char)
end   


end

