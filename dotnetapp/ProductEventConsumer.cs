using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.SignalR;

public class ProductEventConsumer : BackgroundService
{
    private readonly ServiceBusProcessor _processor;
    private readonly IHubContext<ProductHub> _hubContext;
    private readonly ILogger<ProductEventConsumer> _logger;
 
    public ProductEventConsumer(ServiceBusClient sbClient, IHubContext<ProductHub> hubContext, ILogger<ProductEventConsumer> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
        _processor = sbClient.CreateProcessor("product-events", new ServiceBusProcessorOptions());
        _processor.ProcessMessageAsync += HandleMessageAsync;
        _processor.ProcessErrorAsync += HandleErrorAsync;
    }
 
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        => await _processor.StartProcessingAsync(stoppingToken);
 
    private async Task HandleMessageAsync(ProcessMessageEventArgs args)
    {
        var body = args.Message.Body.ToString();
        _logger.LogInformation("CONSUMED event [{Subject}]: {Body}", args.Message.Subject, body);
 
        await _hubContext.Clients.All.SendAsync("ProductEvent", args.Message.Subject, body);
 
        await args.CompleteMessageAsync(args.Message);
    }
 
    private Task HandleErrorAsync(ProcessErrorEventArgs args)
    {
        _logger.LogError(args.Exception, "Service Bus processing error");
        return Task.CompletedTask;
    }
}

public class ProductHub : Hub { }