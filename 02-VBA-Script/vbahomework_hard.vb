Sub VBAScript():
    '' Declaring Variables
    Dim Total_Volume As Double
    Dim Stock_Count As Integer
    Dim Stock_Change As Double
    Dim Percent_Change As Double
    Dim Opening As Double
    Dim Highest_Increase As Double
    Dim Highest_Decrease As Double
    Dim Highest_Volume As Double
    Dim Ticker_Name As String
    
    ''Finding last row of ticker data in order to loop correctly
    Last_Row = Cells(Rows.Count, 1).End(xlUp).Row

    '' Initializing some variables to be safe
    Ticker_Name = "N/A"
    Stock_Count = 0
    Total_Volume = 0
    Highest_Volume = 0
    Highest_Increase = 0
    Highest_Decrease = 0
    
    '' Looping until one row past the last row in order to get values for everything
    For i = 2 To Last_Row + 1:
    
        '' Checking for difference in ticker name and next row
        If Ticker_Name <> Cells(i, 1).Value Then
            
            '' Making sure previous cell isn't <open> to loop for year and percent change properly
            If Cells((i - 1), 3) <> "<open>" Then
                
                '' Computing stock change between final close and first opening
                Stock_Change = Cells((i - 1), 6).Value - Opening
                
                '' In order to avoid non-zero division (PLNT in Year 2015)
                If Opening <> 0 Then
                    Percent_Change = Stock_Change / Opening
                Else
                    Percent_Change = 0
                End If
                
                '' Inputting values in the main summary table for stock and percent change along with formatting
                Cells(Stock_Count + 1, 10).Value = Stock_Change
                Cells(Stock_Count + 1, 11).Value = Percent_Change
                Cells(Stock_Count + 1, 11).Style = "Percent"


                '' Appending highest % increase found to the largest summary table
                If Percent_Change >= Highest_Increase Then
                    Highest_Increase = Percent_Change
                    Range("P2").Value = Ticker_Name
                    Range("Q2").Value = Percent_Change
                    Range("Q2").Style = "Percent"
                    
                '' Appending highest % decrease found to the largest summary table
                ElseIf Percent_Change <= Highest_Decrease Then
                    Highest_Decrease = Percent_Change
                    Range("P3").Value = Ticker_Name
                    Range("Q3").Value = Percent_Change
                    Range("Q3").Style = "Percent"
                    
                End If
                
            End If
            
            '' Appending total value to the main summary table
            Cells(Stock_Count + 1, 12).Value = Total_Volume
            
            '' Appending highest volume found to the largest summary table
            If Total_Volume > Highest_Volume Then
                Highest_Volume = Total_Volume
                Range("P4").Value = Ticker_Name
                Range("Q4").Value = Total_Volume
            End If
            
            '' Finding the new ticker name for the next loop around
            Ticker_Name = Cells(i, 1).Value
            
            '' Adding to the stock_count to make it easier to format the main summary table.
            Stock_Count = Stock_Count + 1
            
            '' Appending the ticker_name to the main summary table
            Cells(Stock_Count + 1, 9).Value = Ticker_Name
            
            '' Resetting total volume for the newest ticker
            Total_Volume = 0
            
            '' Initializing the new opening of the new ticker
            Opening = Cells(i, 3).Value
        Else
            '' If ticker name is the same, add up all the volume this way
            Total_Volume = Total_Volume + Cells(i, 7).Value
        End If
    Next i
    
    '' Creating headers for the main summary table
    Range("I1").Value = "Ticker"
    Range("J1").Value = "Yearly Change"
    Range("K1").Value = "Percent Change"
    Range("L1").Value = "Total Stock Volume"
    
    '' Creating headers for the largest table
    Range("P1").Value = "Ticker"
    Range("Q1").Value = "Value"
    Range("O2").Value = "Greatest % Increase"
    Range("O3").Value = "Greatest % Decrease"
    Range("O4").Value = "Greatest Total Volume"
    
    '' Grabbing the last row of the summary table for color-coding
    Last_Row_Summary = Cells(Rows.Count, 9).End(xlUp).Row
    
    '' Color-coding the percentage change in the summary table
    For i = 2 To Last_Row_Summary:
        If Cells(i, 10) >= 0 Then
            Cells(i, 10).Interior.Color = RGB(0, 200, 0)
        Else
            Cells(i, 10).Interior.Color = RGB(200, 0, 0)
        End If
    Next i
    
    '' Auto-fitting the columns for presentation purposes
    Cells.Columns.AutoFit
    
End Sub