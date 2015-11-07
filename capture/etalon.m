function etalon
    gesture = 'V';
    filename = strcat('captures/',gesture,'.csv');
    data = csvread(filename);
    D = [];
    M = [];
    [height, width] = size(data);
    figure(2)
    clf
    hold on
  
    for i = 1:1:width
       plot(1:1:width, data(i, :), '.','MarkerSize', 4.8);
       mi = mean(data(:, i));
       M=[M, mi];
       plot(i, mi, 'x', 'Color', 'red','MarkerSize', 15);
       D=[D, var(data(:, i))];
       
    end
    
    file = fopen('result.txt','w');
    fprintf(file, '%s\n', gesture);
    formatSpec = '%9.7f, ';
    fprintf(file, formatSpec, M);
    fprintf(file, '\n');
    fprintf(file, formatSpec, D);
    fprintf(file, '\n');

end