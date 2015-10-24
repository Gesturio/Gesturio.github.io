function statisc
    filename = 'statistic/statistic.csv';
    fid = fopen(filename);
    data = textscan(fid,'%s %s %s %s %s %s','delimiter',',');
    fclose(fid);
    
    res = {
        'A', [0,0,0,0,0], 1;
        'B', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;   
        '�', [0,0,0,0,0], 1; 
        '�', [0,0,0,0,0], 1; 
        '�', [0,0,0,0,0], 1; 
        '�', [0,0,0,0,0], 1;
        '�', [0,0,0,0,0], 1;        
        '�', [0,0,0,0,0], 1;         
        '�', [0,0,0,0,0], 1;         
        '�', [0,0,0,0,0], 1;        
    };
       
    for i = 1 : 1: length(data{1})
        target = data{1}{i};
        target_index = alias(target);
        res{target_index, 3} = res{target_index, 3} + 1;
        for j = 2 : 1 : length(data)            
            if(data{j}{i} == target)
                res{target_index, 2}(j-1) = res{target_index, 2}(j-1) + 1;
            end;
        end;        
    end
    file = fopen('statistic/result.txt', 'w');
    for i = 1 : 1: length(res)
        res{i, 3}
        for j = 1 : 1 : length(res{i, 2})
            res{i, 2}(j) = res{i, 2}(j) / res{i, 3} *100;
        end
        fprintf(file, '%s\t%4.2f\t%4.2f\t%4.2f\t%4.2f\t%4.2f\r\n',res{i, 1}, res{i, 2} );
        display(res{i, 1});
        display(res{i, 2});           
    end
end
